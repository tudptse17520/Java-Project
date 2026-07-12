package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
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
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/pricing-policies")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'STAFF', 'MANAGER', 'ADMIN')")
@Tag(name = "Pricing Policy")
public class PricingPolicyController {

    private final PricingPolicyService pricingPolicyService;

    // ==================== GET - Lấy danh sách / Tìm kiếm ====================

    /**
     * Lấy danh sách toàn bộ bảng giá trong hệ thống.
     *
     * @return HTTP 200 kèm danh sách bảng giá
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPricingPolicies() {
        Map<String, Object> response = pricingPolicyService.getAllPricingPolicies();
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách bảng giá lọc theo vehicle_type_id.
     * Trả về thông báo nếu loại xe chưa có bảng giá.
     *
     * @param vehicleTypeId mã loại xe để lọc
     * @return HTTP 200 kèm danh sách bảng giá
     */
    @GetMapping("/vehicle-type/{vehicleTypeId}")
    public ResponseEntity<Map<String, Object>> getPricingPoliciesByVehicleTypeId(
            @PathVariable Long vehicleTypeId) {
        Map<String, Object> response = pricingPolicyService.getPricingPoliciesByVehicleTypeId(vehicleTypeId);
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
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
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
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
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
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
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
