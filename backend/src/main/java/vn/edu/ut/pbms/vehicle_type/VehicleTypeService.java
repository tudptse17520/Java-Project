package vn.edu.ut.pbms.vehicle_type;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.common.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.common.exception.ConflictException;
import vn.edu.ut.pbms.common.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.parking_session.ParkingSessionRepository;
import vn.edu.ut.pbms.parking_session.ParkingSessionStatus;
import vn.edu.ut.pbms.pricing_policy.PricingPolicyRepository;
import vn.edu.ut.pbms.pricing_policy.PricingPolicyStatus;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for VehicleType business logic.
 * Handles all CRUD operations and business rule validations (E2, E3).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;
    private final PricingPolicyRepository pricingPolicyRepository;
    private final ParkingSessionRepository parkingSessionRepository;

    // ==================== GET - Lấy danh sách ====================

    /**
     * Retrieve all vehicle types and map them to response DTOs.
     *
     * @return list of all vehicle types
     */
    @Transactional(readOnly = true)
    public List<VehicleTypeResponseDTO> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ==================== POST - Thêm mới ====================

    /**
     * Create a new vehicle type.
     * - E1 (empty name) is handled automatically by @NotBlank validation in DTO.
     * - E2 (duplicate name) is checked here.
     * - Default status is ACTIVE.
     *
     * @param requestDTO the vehicle type data from the client
     * @return the created vehicle type as a response DTO
     * @throws ConflictException if a vehicle type with the same name already exists (E2)
     */
    public VehicleTypeResponseDTO createVehicleType(VehicleTypeRequestDTO requestDTO) {
        // E2: Check duplicate name
        if (vehicleTypeRepository.existsByTypeName(requestDTO.getTypeName())) {
            throw new ConflictException(
                    "Loại phương tiện '" + requestDTO.getTypeName() + "' đã tồn tại trong hệ thống.");
        }

        // Build entity with default ACTIVE status
        VehicleType vehicleType = VehicleType.builder()
                .typeName(requestDTO.getTypeName())
                .description(requestDTO.getDescription())
                .status(VehicleTypeStatus.ACTIVE)
                .build();

        VehicleType savedVehicleType = vehicleTypeRepository.save(vehicleType);
        return mapToResponseDTO(savedVehicleType);
    }

    // ==================== PUT - Cập nhật ====================

    /**
     * Update an existing vehicle type.
     * - E1 (empty name) is handled automatically by @NotBlank validation in DTO.
     * - E2 (duplicate name) is checked here, excluding the current entity's own name.
     *
     * @param id         the ID of the vehicle type to update
     * @param requestDTO the updated vehicle type data
     * @return the updated vehicle type as a response DTO
     * @throws ResourceNotFoundException if the vehicle type ID is not found
     * @throws ConflictException         if the new name conflicts with another vehicle type (E2)
     */
    public VehicleTypeResponseDTO updateVehicleType(Long id, VehicleTypeRequestDTO requestDTO) {
        // Find existing entity or throw 404
        VehicleType vehicleType = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy loại phương tiện với ID: " + id));

        // E2: Check duplicate name (excluding this entity's own ID)
        if (vehicleTypeRepository.existsByTypeNameAndIdNot(requestDTO.getTypeName(), id)) {
            throw new ConflictException(
                    "Loại phương tiện '" + requestDTO.getTypeName() + "' đã tồn tại trong hệ thống.");
        }

        // Update fields
        vehicleType.setTypeName(requestDTO.getTypeName());
        vehicleType.setDescription(requestDTO.getDescription());
        if (requestDTO.getStatus() != null) {
            vehicleType.setStatus(requestDTO.getStatus());
        }

        VehicleType updatedVehicleType = vehicleTypeRepository.save(vehicleType);
        return mapToResponseDTO(updatedVehicleType);
    }

    // ==================== PATCH - Ngừng áp dụng ====================

    /**
     * Deactivate a vehicle type by setting its status to INACTIVE.
     * Performs E3 business rule checks:
     * 1. No active pricing policies referencing this vehicle type.
     * 2. No vehicles of this type currently parked (ParkingSession status = IN).
     *
     * @param id the ID of the vehicle type to deactivate
     * @return the deactivated vehicle type as a response DTO
     * @throws ResourceNotFoundException        if the vehicle type ID is not found
     * @throws BusinessRuleViolationException    if deactivation is blocked by E3 rules
     */
    public VehicleTypeResponseDTO deactivateVehicleType(Long id) {
        // Find existing entity or throw 404
        VehicleType vehicleType = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy loại phương tiện với ID: " + id));

        // E3 Check 1: Active pricing policies
        boolean hasActivePricingPolicy = pricingPolicyRepository
                .existsByVehicleTypeIdAndStatus(id, PricingPolicyStatus.ACTIVE);
        if (hasActivePricingPolicy) {
            throw new BusinessRuleViolationException(
                    "Không thể ngừng áp dụng loại phương tiện này vì đang có bảng giá đang kích hoạt liên kết.");
        }

        // E3 Check 2: Vehicles currently parked (ParkingSession status = IN)
        boolean hasActiveParking = parkingSessionRepository
                .existsByVehicleVehicleTypeIdAndStatus(id, ParkingSessionStatus.IN);
        if (hasActiveParking) {
            throw new BusinessRuleViolationException(
                    "Không thể ngừng áp dụng loại phương tiện này vì đang có xe thuộc danh mục này đang đỗ trong bãi.");
        }

        // All checks passed — deactivate
        vehicleType.setStatus(VehicleTypeStatus.INACTIVE);
        VehicleType deactivatedVehicleType = vehicleTypeRepository.save(vehicleType);
        return mapToResponseDTO(deactivatedVehicleType);
    }

    // ==================== Helper ====================

    /**
     * Map a VehicleType entity to a VehicleTypeResponseDTO.
     */
    private VehicleTypeResponseDTO mapToResponseDTO(VehicleType vehicleType) {
        return VehicleTypeResponseDTO.builder()
                .id(vehicleType.getId())
                .typeName(vehicleType.getTypeName())
                .description(vehicleType.getDescription())
                .status(vehicleType.getStatus())
                .build();
    }
}
