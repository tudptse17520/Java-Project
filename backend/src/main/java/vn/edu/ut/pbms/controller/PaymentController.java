package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import vn.edu.ut.pbms.dto.request.ManualStatusRequestDTO;
import vn.edu.ut.pbms.dto.request.PaymentRequestDTO;
import vn.edu.ut.pbms.dto.response.PaymentListResponseDTO;
import vn.edu.ut.pbms.dto.response.PaymentResponseDTO;
import vn.edu.ut.pbms.service.PaymentService;

/**
 * REST Controller for Payment Management.
 * Base endpoint: /api/v1/payments
 *
 * Endpoints:
 * - POST   /api/v1/payments                → Tạo thanh toán (201)
 * - GET    /api/v1/payments                → Danh sách giao dịch (200)
 * - GET    /api/v1/payments/{id}           → Chi tiết biên lai (200)
 * - PATCH  /api/v1/payments/{id}/status    → Staff cập nhật thủ công (200)
 * - PATCH  /api/v1/payments/{id}/cancel    → Hủy giao dịch (200)
 *
 * Nghiêm cấm khai báo @DeleteMapping.
 */
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment")
public class PaymentController {

    private final PaymentService paymentService;

    // ==================== POST - Tạo thanh toán ====================

    /**
     * Create a new payment transaction.
     * Validates E2 (Fixed Fee Mismatch) and E3 (Overpayment Violation).
     * Cash payments are automatically set to SUCCESS.
     *
     * @param requestDTO the payment data (validated with @Valid)
     * @return HTTP 201 Created with the created payment
     */
    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(
            @Valid @RequestBody PaymentRequestDTO requestDTO,
            HttpServletRequest request) {
        PaymentResponseDTO createdPayment = paymentService.createPayment(requestDTO, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }

    /**
     * Get the remaining debt details for a parking session.
     * This provides total fee, paid fee (including booking deposits), and remaining fee.
     *
     * @param sessionId the parking session ID
     * @return the debt details
     */
    @GetMapping("/sessions/{sessionId}/debt")
    public ResponseEntity<vn.edu.ut.pbms.dto.response.PaymentDebtResponseDTO> getRemainingDebt(
            @PathVariable("sessionId") Long sessionId) {
        vn.edu.ut.pbms.dto.response.PaymentDebtResponseDTO response = paymentService.getRemainingDebt(sessionId);
        return ResponseEntity.ok(response);
    }

    // ==================== GET - Danh sách giao dịch ====================

    /**
     * Retrieve a filtered list of payment transactions.
     * All query parameters are optional.
     *
     * @param paymentMethod filter by payment method (Cash, Momo, Vnpay, Credit_Card)
     * @param status        filter by payment status (PENDING, SUCCESS, FAILED, CANCELLED)
     * @param fromDate      filter from date (format DD-MM-YYYY)
     * @return HTTP 200 OK with wrapped payment list
     */
    @GetMapping
    public ResponseEntity<PaymentListResponseDTO> getPayments(
            @RequestParam(name = "payment_method", required = false) String paymentMethod,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "from_date", required = false) String fromDate) {
        PaymentListResponseDTO response = paymentService.getPayments(paymentMethod, status, fromDate);
        return ResponseEntity.ok(response);
    }

    // ==================== GET - Chi tiết biên lai ====================

    /**
     * Retrieve detail of a specific payment receipt.
     *
     * @param id the payment ID (path variable)
     * @return HTTP 200 OK with payment detail
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable Long id) {
        PaymentResponseDTO response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(response);
    }

    // ==================== PATCH - Staff cập nhật thủ công ====================

    /**
     * Staff manual update of a PENDING payment status.
     * Requires status (SUCCESS/FAILED) and audit note (min 10 chars).
     *
     * @param id         the payment ID (path variable)
     * @param requestDTO the new status and audit note
     * @return HTTP 200 OK with updated payment
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentResponseDTO> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody ManualStatusRequestDTO requestDTO) {
        PaymentResponseDTO updatedPayment = paymentService.updatePaymentStatus(id, requestDTO);
        return ResponseEntity.ok(updatedPayment);
    }

    // ==================== PATCH - Hủy giao dịch ====================

    /**
     * Cancel a PENDING payment transaction.
     *
     * @param id the payment ID (path variable)
     * @return HTTP 200 OK with cancelled payment
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<PaymentResponseDTO> cancelPayment(@PathVariable Long id) {
        PaymentResponseDTO cancelledPayment = paymentService.cancelPayment(id);
        return ResponseEntity.ok(cancelledPayment);
    }

    // ==================== VNPAY IPN Webhook ====================

    /**
     * Webhook endpoint for VNPAY Instant Payment Notification (IPN).
     *
     * @param request the HTTP request containing VNPAY parameters
     * @return HTTP 200 OK with VNPAY formatted JSON response
     */
    @GetMapping("/vnpay-ipn")
    public ResponseEntity<String> processVnpayIpn(HttpServletRequest request) {
        return paymentService.processVnpayIpn(request);
    }
}
