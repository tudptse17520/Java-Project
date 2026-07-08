package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.ManualStatusRequestDTO;
import vn.edu.ut.pbms.dto.request.PaymentRequestDTO;
import vn.edu.ut.pbms.dto.response.PaymentListResponseDTO;
import vn.edu.ut.pbms.dto.response.PaymentResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

/**
 * Service interface for Payment business logic.
 * Defines all operations for managing payments including
 * creation with E2/E3 validation, listing, detail view,
 * staff manual update, and cancellation.
 */
public interface PaymentService {

    /**
     * Create a new payment transaction.
     * Handles E2 (Fixed Fee Mismatch) and E3 (Overpayment Violation) validations.
     * Cash payments are automatically set to SUCCESS.
     *
     * @param requestDTO the payment data from the client
     * @param request the HTTP request for IP tracking
     * @return the created payment as a response DTO
     */
    PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO, HttpServletRequest request);

    /**
     * Retrieve a filtered list of payment transactions.
     *
     * @param paymentMethod filter by payment method (nullable)
     * @param status        filter by payment status (nullable)
     * @param fromDate      filter from date in DD-MM-YYYY format (nullable)
     * @return wrapped response with total_items, message, and data list
     */
    PaymentListResponseDTO getPayments(String paymentMethod, String status, String fromDate);

    /**
     * Retrieve detail of a specific payment by ID.
     *
     * @param id the payment ID
     * @return the payment detail as a response DTO
     */
    PaymentResponseDTO getPaymentById(Long id);

    /**
     * Staff manual update of a PENDING payment status.
     * Validates that the payment is still PENDING and that the audit note is sufficient.
     *
     * @param id         the payment ID to update
     * @param requestDTO the new status and audit note
     * @return the updated payment as a response DTO
     */
    PaymentResponseDTO updatePaymentStatus(Long id, ManualStatusRequestDTO requestDTO);

    /**
     * Cancel a PENDING payment transaction.
     *
     * @param id the payment ID to cancel
     * @return the cancelled payment as a response DTO
     */
    PaymentResponseDTO cancelPayment(Long id);

    /**
     * Process VNPAY Webhook IPN callback.
     *
     * @param request the HTTP request containing VNPAY parameters
     * @return JSON response indicating success or failure to VNPAY
     */
    ResponseEntity<String> processVnpayIpn(HttpServletRequest request);
}
