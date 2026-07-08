package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.MessageConstants;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;
import vn.edu.ut.pbms.dto.request.PricingPolicyRequestDTO;
import vn.edu.ut.pbms.dto.response.PricingPolicyResponseDTO;
import vn.edu.ut.pbms.entity.PricingPolicy;
import vn.edu.ut.pbms.entity.VehicleType;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.repository.PricingPolicyCrudRepository;
import vn.edu.ut.pbms.repository.VehicleTypeRepository;
import vn.edu.ut.pbms.service.PricingPolicyService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of PricingPolicyService.
 * Xử lý toàn bộ nghiệp vụ CRUD và các ngoại lệ E1, E2, E3 cho module Quản lý bảng giá.
 *
 * E3 check: Sử dụng ParkingSessionRepository có sẵn (không sửa code cũ).
 * Kiểm tra qua vehicle type xem có ParkingSession nào đang IN_PROGRESS hoặc COMPLETED.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PricingPolicyServiceImpl implements PricingPolicyService {

    private final PricingPolicyCrudRepository pricingPolicyCrudRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final ParkingSessionRepository parkingSessionRepository;

    // ==================== GET - Lấy danh sách / Tìm kiếm ====================

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAllPricingPolicies(Long vehicleTypeId) {
        List<PricingPolicy> policies;

        if (vehicleTypeId != null) {
            // Lọc theo loại xe cụ thể
            policies = pricingPolicyCrudRepository.findByVehicleType_Id(vehicleTypeId);
        } else {
            // Lấy toàn bộ danh sách
            policies = pricingPolicyCrudRepository.findAll();
        }

        List<PricingPolicyResponseDTO> data = policies.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("message", MessageConstants.PRICING_POLICY_LIST_SUCCESS);
        response.put("data", data);
        return response;
    }

    // ==================== POST - Thêm mới ====================

    @Override
    public Map<String, Object> createPricingPolicy(PricingPolicyRequestDTO requestDTO) {
        // Kiểm tra VehicleType có tồn tại không
        VehicleType vehicleType = vehicleTypeRepository.findById(requestDTO.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        MessageConstants.VEHICLE_TYPE_NOT_FOUND + requestDTO.getVehicleTypeId()));

        // Convert LocalDate từ DTO sang LocalDateTime cho Entity
        LocalDateTime effectiveDateTime = requestDTO.getEffectiveDate().atStartOfDay();

        // E2: Kiểm tra trùng lặp ngày áp dụng của cùng loại xe
        if (pricingPolicyCrudRepository.existsByVehicleType_IdAndEffectiveDate(
                requestDTO.getVehicleTypeId(), effectiveDateTime)) {
            throw new ConflictException(MessageConstants.PRICING_POLICY_DUPLICATE);
        }

        // Tạo entity mới và lưu vào DB
        PricingPolicy pricingPolicy = PricingPolicy.builder()
                .vehicleType(vehicleType)
                .basePrice(requestDTO.getBasePrice())
                .extraFeePerHour(requestDTO.getExtraFeePerHour())
                .effectiveDate(effectiveDateTime)
                .status(requestDTO.getStatus() != null ? requestDTO.getStatus() : vn.edu.ut.pbms.constant.PricingPolicyStatus.ACTIVE)
                .build();

        PricingPolicy savedPolicy = pricingPolicyCrudRepository.save(pricingPolicy);

        // Trả về response theo API Contract: { id, message }
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedPolicy.getId());
        response.put("message", MessageConstants.PRICING_POLICY_CREATE_SUCCESS);
        return response;
    }

    // ==================== PUT - Cập nhật ====================

    @Override
    public Map<String, Object> updatePricingPolicy(Long id, PricingPolicyRequestDTO requestDTO) {
        // Tìm entity theo ID
        PricingPolicy pricingPolicy = pricingPolicyCrudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        MessageConstants.PRICING_POLICY_NOT_FOUND + id));

        // E3: Kiểm tra ràng buộc dữ liệu - không cập nhật nếu loại xe của bảng giá này
        // đang có ParkingSession IN_PROGRESS hoặc COMPLETED
        checkParkingSessionConstraint(pricingPolicy.getVehicleType().getId(),
                MessageConstants.PRICING_POLICY_IN_USE_UPDATE);

        // Kiểm tra VehicleType mới có tồn tại không
        VehicleType vehicleType = vehicleTypeRepository.findById(requestDTO.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        MessageConstants.VEHICLE_TYPE_NOT_FOUND + requestDTO.getVehicleTypeId()));

        // Convert LocalDate từ DTO sang LocalDateTime cho Entity
        LocalDateTime effectiveDateTime = requestDTO.getEffectiveDate().atStartOfDay();

        // E2: Kiểm tra trùng lặp ngày áp dụng (loại trừ bản ghi hiện tại)
        if (pricingPolicyCrudRepository.existsByVehicleType_IdAndEffectiveDateAndIdNot(
                requestDTO.getVehicleTypeId(), effectiveDateTime, id)) {
            throw new ConflictException(MessageConstants.PRICING_POLICY_DUPLICATE);
        }

        // Cập nhật thông tin
        pricingPolicy.setVehicleType(vehicleType);
        pricingPolicy.setBasePrice(requestDTO.getBasePrice());
        pricingPolicy.setExtraFeePerHour(requestDTO.getExtraFeePerHour());
        pricingPolicy.setEffectiveDate(effectiveDateTime);
        if (requestDTO.getStatus() != null) {
            pricingPolicy.setStatus(requestDTO.getStatus());
        }

        PricingPolicy updatedPolicy = pricingPolicyCrudRepository.save(pricingPolicy);

        // Trả về response theo API Contract: { id, message }
        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedPolicy.getId());
        response.put("message", MessageConstants.PRICING_POLICY_UPDATE_SUCCESS);
        return response;
    }

    // ==================== DELETE - Xóa ====================

    @Override
    public Map<String, Object> deletePricingPolicy(Long id) {
        // Tìm entity theo ID
        PricingPolicy pricingPolicy = pricingPolicyCrudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        MessageConstants.PRICING_POLICY_NOT_FOUND + id));

        // E3: Kiểm tra ràng buộc dữ liệu - không xóa nếu loại xe của bảng giá này
        // đang có ParkingSession IN_PROGRESS hoặc COMPLETED
        checkParkingSessionConstraint(pricingPolicy.getVehicleType().getId(),
                MessageConstants.PRICING_POLICY_IN_USE_DELETE);

        // Xóa bản ghi khỏi DB
        pricingPolicyCrudRepository.delete(pricingPolicy);

        // Trả về response theo API Contract: { message }
        Map<String, Object> response = new HashMap<>();
        response.put("message", MessageConstants.PRICING_POLICY_DELETE_SUCCESS);
        return response;
    }

    // ==================== Helper ====================

    /**
     * Kiểm tra ràng buộc E3: xem có ParkingSession nào đang IN_PROGRESS hoặc COMPLETED
     * cho loại xe của bảng giá này không.
     * Sử dụng ParkingSessionRepository có sẵn (không sửa code cũ).
     *
     * @param vehicleTypeId mã loại xe cần kiểm tra
     * @param errorMessage  thông báo lỗi nếu vi phạm ràng buộc
     */
    private void checkParkingSessionConstraint(Long vehicleTypeId, String errorMessage) {
        boolean hasInProgressSession = parkingSessionRepository
                .existsByVehicle_VehicleType_IdAndStatus(vehicleTypeId, ParkingSessionStatus.IN_PROGRESS);
        boolean hasCompletedSession = parkingSessionRepository
                .existsByVehicle_VehicleType_IdAndStatus(vehicleTypeId, ParkingSessionStatus.COMPLETED);

        if (hasInProgressSession || hasCompletedSession) {
            throw new BusinessRuleViolationException(errorMessage);
        }
    }

    /**
     * Map PricingPolicy entity sang PricingPolicyResponseDTO.
     * Convert LocalDateTime (entity) sang LocalDate (DTO) cho format DD-MM-YYYY.
     */
    private PricingPolicyResponseDTO mapToResponseDTO(PricingPolicy pricingPolicy) {
        return PricingPolicyResponseDTO.builder()
                .id(pricingPolicy.getId())
                .vehicleTypeId(pricingPolicy.getVehicleType().getId())
                .basePrice(pricingPolicy.getBasePrice())
                .extraFeePerHour(pricingPolicy.getExtraFeePerHour())
                .effectiveDate(pricingPolicy.getEffectiveDate().toLocalDate())
                .status(pricingPolicy.getStatus())
                .build();
    }
}
