package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.constant.MessageConstants;
import vn.edu.ut.pbms.dto.request.PricingPolicyRequestDTO;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.service.PricingPolicyService;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller cho module Quản lý bảng giá (Pricing Policy Management).
 * Base endpoint: /api/v1/pricing-policies
 *
 * Endpoints:
 * - GET    /api/v1/pricing-policies               → Lấy danh sách / Tìm kiếm (200)
 * - POST   /api/v1/pricing-policies               → Thêm mới (201)
 * - PUT    /api/v1/pricing-policies/{id}           → Cập nhật (200)
 * - DELETE /api/v1/pricing-policies/{id}           → Xóa (200)
 *
 * Xử lý ngoại lệ:
 * - E1 (bỏ trống): @Valid + @NotNull/@Positive → 400 (qua GlobalExceptionHandler)
 * - E2 (trùng lặp): Service ném ConflictException → 409 (qua GlobalExceptionHandler)
 * - E3 (ràng buộc): Controller tự catch BusinessRuleViolationException
 *                    → 400 với error: "BUSINESS_RULE_VIOLATION" (đúng API Contract)
 */
@RestController
@RequestMapping("/api/v1/pricing-policies")
@RequiredArgsConstructor
public class PricingPolicyController {

    private final PricingPolicyService pricingPolicyService;

    // ==================== GET - Lấy danh sách / Tìm kiếm ====================

    /**
     * Lấy danh sách bảng giá, có thể lọc theo vehicle_type_id (tùy chọn).
     * Staff gọi để tính tiền, Manager gọi để xem danh sách.
     *
     * @param vehicleTypeId (tùy chọn) mã loại xe để lọc
     * @return HTTP 200 kèm danh sách bảng giá
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPricingPolicies(
            @RequestParam(value = "vehicle_type_id", required = false) Long vehicleTypeId) {
        Map<String, Object> response = pricingPolicyService.getAllPricingPolicies(vehicleTypeId);
        return ResponseEntity.ok(response);
    }

    // ==================== POST - Thêm mới ====================

    /**
     * Thêm mới một bảng giá.
     * - E1 (bỏ trống): Tự động chặn bởi @Valid + @NotNull, @Positive → 400
     * - E2 (trùng lặp ngày): Service kiểm tra → 409
     *
     * @param requestDTO dữ liệu bảng giá (đã validate)
     * @return HTTP 201 với { id, message }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPricingPolicy(
            @Valid @RequestBody PricingPolicyRequestDTO requestDTO) {
        Map<String, Object> response = pricingPolicyService.createPricingPolicy(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== PUT - Cập nhật ====================

    /**
     * Cập nhật thông số giá cơ bản, phí phụ thu hoặc ngày bắt đầu hiệu lực.
     * - E1 (bỏ trống): Tự động chặn bởi @Valid → 400
     * - E2 (trùng lặp ngày): Service kiểm tra → 409
     * - E3 (ràng buộc dữ liệu): Service ném exception → Controller trả 400
     *
     * @param id         ID bảng giá cần cập nhật (path variable)
     * @param requestDTO dữ liệu cập nhật (đã validate)
     * @return HTTP 200 với { id, message }
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePricingPolicy(
            @PathVariable Long id,
            @Valid @RequestBody PricingPolicyRequestDTO requestDTO) {
        try {
            Map<String, Object> response = pricingPolicyService.updatePricingPolicy(id, requestDTO);
            return ResponseEntity.ok(response);
        } catch (BusinessRuleViolationException ex) {
            // E3: Trả về đúng format API Contract
            return buildBusinessRuleViolationResponse(ex.getMessage());
        }
    }

    // ==================== DELETE - Xóa ====================

    /**
     * Xóa một chính sách tính phí khỏi hệ thống.
     * - E3 (ràng buộc dữ liệu): Service ném exception → Controller trả 400
     *   với { "error": "BUSINESS_RULE_VIOLATION", "message": "..." }
     *
     * @param id ID bảng giá cần xóa (path variable)
     * @return HTTP 200 với { message } nếu thành công
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePricingPolicy(@PathVariable Long id) {
        try {
            Map<String, Object> response = pricingPolicyService.deletePricingPolicy(id);
            return ResponseEntity.ok(response);
        } catch (BusinessRuleViolationException ex) {
            // E3: Trả về đúng format API Contract Section 4.4.B
            return buildBusinessRuleViolationResponse(ex.getMessage());
        }
    }

    // ==================== Helper ====================

    /**
     * Tạo response E3 đúng format API Contract:
     * { "error": "BUSINESS_RULE_VIOLATION", "message": "..." }
     * HTTP Status: 400 Bad Request
     */
    private ResponseEntity<Map<String, Object>> buildBusinessRuleViolationResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", MessageConstants.BUSINESS_RULE_VIOLATION);
        errorResponse.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
