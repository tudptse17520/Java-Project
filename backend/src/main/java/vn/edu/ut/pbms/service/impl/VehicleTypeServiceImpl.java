package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;
import vn.edu.ut.pbms.constant.PricingPolicyStatus;
import vn.edu.ut.pbms.constant.VehicleTypeStatus;
import vn.edu.ut.pbms.dto.request.VehicleTypeRequestDTO;
import vn.edu.ut.pbms.dto.response.VehicleTypeResponseDTO;
import vn.edu.ut.pbms.entity.VehicleType;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.repository.PricingPolicyRepository;
import vn.edu.ut.pbms.repository.VehicleTypeRepository;
import vn.edu.ut.pbms.service.VehicleTypeService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of VehicleTypeService.
 * Handles all CRUD operations and business rule validations (E2, E3).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class VehicleTypeServiceImpl implements VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;
    private final PricingPolicyRepository pricingPolicyRepository;
    private final ParkingSessionRepository parkingSessionRepository;

    // ==================== GET - Lấy danh sách ====================

    @Override
    @Transactional(readOnly = true)
    public List<VehicleTypeResponseDTO> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ==================== POST - Thêm mới ====================

    @Override
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

    @Override
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

    @Override
    public VehicleTypeResponseDTO deactivateVehicleType(Long id) {
        // Find existing entity or throw 404
        VehicleType vehicleType = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy loại phương tiện với ID: " + id));

        // E3 Check 1: Active pricing policies
        boolean hasActivePricingPolicy = pricingPolicyRepository
                .existsByVehicleType_IdAndStatus(id, PricingPolicyStatus.ACTIVE);
        if (hasActivePricingPolicy) {
            throw new BusinessRuleViolationException(
                    "Không thể ngừng áp dụng loại phương tiện này vì đang có bảng giá đang kích hoạt liên kết.");
        }

        // E3 Check 2: Vehicles currently parked (ParkingSession status = IN)
        boolean hasActiveParking = parkingSessionRepository
                .existsByVehicle_VehicleType_IdAndStatus(id, ParkingSessionStatus.IN);
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
