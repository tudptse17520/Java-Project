package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.FeeType;
import vn.edu.ut.pbms.constant.PaymentMethod;
import vn.edu.ut.pbms.constant.PaymentStatus;
import vn.edu.ut.pbms.dto.request.ManualStatusRequestDTO;
import vn.edu.ut.pbms.dto.request.PaymentRequestDTO;
import vn.edu.ut.pbms.dto.response.PaymentListResponseDTO;
import vn.edu.ut.pbms.dto.response.PaymentResponseDTO;
import vn.edu.ut.pbms.entity.Booking;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.entity.Payment;
import vn.edu.ut.pbms.entity.PricingPolicy;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.exception.InvalidStateTransitionException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.BookingRepository;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.repository.PaymentCustomRepository;
import vn.edu.ut.pbms.repository.PaymentRepository;
import vn.edu.ut.pbms.service.PaymentService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of PaymentService.
 * Handles all payment business logic including:
 * - E2 (Fixed Fee Mismatch) validation for Booking_Deposit and Lost_Ticket_Fine
 * - E3 (Overpayment Violation) validation for Parking_Fee
 * - Cash auto-SUCCESS, electronic payment PENDING flow
 * - Staff manual status update with audit note validation
 * - Payment cancellation
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentCustomRepository paymentCustomRepository;
    private final ParkingSessionRepository parkingSessionRepository;
    private final BookingRepository bookingRepository;

    /**
     * Hằng số mức phạt mất vé mặc định (200.000đ).
     * Áp dụng khi fee_type = Lost_Ticket_Fine.
     */
    private static final BigDecimal DEFAULT_LOST_TICKET_FINE = new BigDecimal("200000");

    private static final DateTimeFormatter RESPONSE_DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    private static final DateTimeFormatter REQUEST_DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    // ==================== CREATE - Tạo thanh toán ====================

    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO) {
        // 1. Validate mutual exclusivity: phải có đúng 1 trong parkingSessionId hoặc bookingId
        validateMutualExclusivity(requestDTO);

        // 2. Validate fee_type enum
        FeeType feeType = parseFeeType(requestDTO.getFeeType());

        // 3. Validate payment_method enum
        PaymentMethod paymentMethod = parsePaymentMethod(requestDTO.getPaymentMethod());

        // 4. E2 Check (Fixed Fee Mismatch) - Booking_Deposit hoặc Lost_Ticket_Fine
        if (feeType == FeeType.Booking_Deposit || feeType == FeeType.Lost_Ticket_Fine) {
            validateFixedFeeMismatch(requestDTO, feeType);
        }

        // 5. E3 Check (Overpayment Violation) - Parking_Fee
        ParkingSession parkingSession = null;
        Booking booking = null;

        if (requestDTO.getParkingSessionId() != null) {
            parkingSession = parkingSessionRepository.findById(requestDTO.getParkingSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy lượt gửi xe với ID: " + requestDTO.getParkingSessionId()));

            if (feeType == FeeType.Parking_Fee) {
                validateOverpayment(requestDTO, parkingSession);
            }
        }

        if (requestDTO.getBookingId() != null) {
            booking = bookingRepository.findById(requestDTO.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy đơn đặt chỗ với ID: " + requestDTO.getBookingId()));
        }

        // 6. Build Payment entity
        Payment payment = Payment.builder()
                .amount(requestDTO.getAmount())
                .paymentMethod(requestDTO.getPaymentMethod())
                .feeType(requestDTO.getFeeType())
                .parkingSession(parkingSession)
                .booking(booking)
                .status(PaymentStatus.PENDING)
                .build();

        // 7. Cash → auto SUCCESS + paymentTime = now()
        if (paymentMethod == PaymentMethod.Cash) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentTime(LocalDateTime.now());
        } else {
            payment.setPaymentTime(LocalDateTime.now());
        }

        // 8. Save to DB
        Payment savedPayment = paymentRepository.save(payment);

        return mapToResponseDTO(savedPayment);
    }

    // ==================== GET - Danh sách giao dịch ====================

    @Override
    @Transactional(readOnly = true)
    public PaymentListResponseDTO getPayments(String paymentMethod, String status, String fromDate) {
        // Convert status String to PaymentStatus enum (nullable)
        PaymentStatus parsedStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                parsedStatus = PaymentStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BusinessRuleViolationException(
                        "Trạng thái '" + status + "' không hợp lệ. Các giá trị hợp lệ: PENDING, SUCCESS, FAILED.");
            }
        }

        // Convert fromDate String (DD-MM-YYYY) to LocalDateTime (nullable)
        LocalDateTime parsedFromDateTime = null;
        if (fromDate != null && !fromDate.isBlank()) {
            LocalDate parsedFromDate = LocalDate.parse(fromDate, REQUEST_DATE_FORMAT);
            parsedFromDateTime = parsedFromDate.atStartOfDay();
        }

        List<Payment> payments = paymentCustomRepository.findByFilters(paymentMethod, parsedStatus, parsedFromDateTime);

        List<PaymentResponseDTO> data = payments.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        return PaymentListResponseDTO.builder()
                .totalItems(data.size())
                .message("Lấy danh sách giao dịch thành công")
                .data(data)
                .build();
    }

    // ==================== GET - Chi tiết biên lai ====================

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy giao dịch thanh toán với ID: " + id));

        return mapToResponseDTO(payment);
    }

    // ==================== PATCH - Staff cập nhật thủ công ====================

    @Override
    public PaymentResponseDTO updatePaymentStatus(Long id, ManualStatusRequestDTO requestDTO) {
        // 1. Find entity
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy giao dịch thanh toán với ID: " + id));

        // 2. Check current status must be PENDING
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new InvalidStateTransitionException(
                    "Giao dịch này đã ở trạng thái " + payment.getStatus() + ", không thể can thiệp thay đổi.");
        }

        // 3. Validate audit note: not blank and minimum 10 characters
        if (requestDTO.getNote() == null || requestDTO.getNote().isBlank()
                || requestDTO.getNote().trim().length() < 10) {
            throw new InvalidStateTransitionException(
                    "Nhân viên bắt buộc phải nhập lý do chi tiết khi thao tác cập nhật thủ công.",
                    "MISSING_AUDIT_NOTE");
        }

        // 4. Parse and validate new status (only SUCCESS or FAILED allowed)
        PaymentStatus newStatus;
        try {
            newStatus = PaymentStatus.valueOf(requestDTO.getStatus());
        } catch (IllegalArgumentException e) {
            throw new BusinessRuleViolationException(
                    "Trạng thái '" + requestDTO.getStatus() + "' không hợp lệ. Chỉ chấp nhận SUCCESS hoặc FAILED.");
        }

        if (newStatus != PaymentStatus.SUCCESS && newStatus != PaymentStatus.FAILED) {
            throw new BusinessRuleViolationException(
                    "Chỉ được phép cập nhật thủ công sang trạng thái SUCCESS hoặc FAILED.");
        }

        // 5. Update status
        payment.setStatus(newStatus);
        if (newStatus == PaymentStatus.SUCCESS) {
            payment.setPaymentTime(LocalDateTime.now());
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponseDTO(updatedPayment);
    }

    // ==================== PATCH - Hủy giao dịch ====================

    @Override
    public PaymentResponseDTO cancelPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy giao dịch thanh toán với ID: " + id));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new InvalidStateTransitionException(
                    "Chỉ có thể hủy giao dịch đang ở trạng thái PENDING. Giao dịch hiện tại đang ở trạng thái "
                            + payment.getStatus() + ".");
        }

        payment.setStatus(PaymentStatus.FAILED);
        Payment cancelledPayment = paymentRepository.save(payment);
        return mapToResponseDTO(cancelledPayment);
    }

    // ==================== Private Helpers ====================

    /**
     * Validate rằng client phải truyền đúng 1 trong 2 tham số parkingSessionId hoặc bookingId.
     */
    private void validateMutualExclusivity(PaymentRequestDTO dto) {
        boolean hasSession = dto.getParkingSessionId() != null;
        boolean hasBooking = dto.getBookingId() != null;

        if (hasSession && hasBooking) {
            throw new BusinessRuleViolationException(
                    "Không thể truyền đồng thời cả parking_session_id và booking_id. Vui lòng chỉ truyền một trong hai.");
        }
        if (!hasSession && !hasBooking) {
            throw new BusinessRuleViolationException(
                    "Bắt buộc phải truyền parking_session_id hoặc booking_id.");
        }
    }

    /**
     * E2: Validate Fixed Fee Mismatch.
     * Kiểm tra số tiền thanh toán phải khớp 100% với mức niêm yết.
     */
    private void validateFixedFeeMismatch(PaymentRequestDTO dto, FeeType feeType) {
        BigDecimal expectedAmount;

        if (feeType == FeeType.Lost_Ticket_Fine) {
            // Lost_Ticket_Fine: so với hằng số mặc định
            expectedAmount = DEFAULT_LOST_TICKET_FINE;
        } else {
            // Booking_Deposit: lấy basePrice từ PricingPolicy qua Booking → Vehicle → VehicleType → PricingPolicy
            if (dto.getBookingId() == null) {
                throw new BusinessRuleViolationException(
                        "Phí cọc đặt chỗ (Booking_Deposit) yêu cầu phải có booking_id.");
            }

            Booking booking = bookingRepository.findById(dto.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy đơn đặt chỗ với ID: " + dto.getBookingId()));

            // Navigate: Booking → Vehicle → VehicleType → PricingPolicies (latest effective)
            if (booking.getVehicle() == null || booking.getVehicle().getVehicleType() == null) {
                throw new BusinessRuleViolationException(
                        "Không thể xác định loại phương tiện từ đơn đặt chỗ để tra cứu mức phí cọc.");
            }

            List<PricingPolicy> policies = booking.getVehicle().getVehicleType().getPricingPolicies();
            if (policies == null || policies.isEmpty()) {
                throw new BusinessRuleViolationException(
                        "Chưa có chính sách giá nào được cấu hình cho loại phương tiện này.");
            }

            // Lấy policy có effectiveDate mới nhất <= thời điểm hiện tại
            LocalDateTime now = LocalDateTime.now();
            PricingPolicy latestPolicy = policies.stream()
                    .filter(p -> !p.getEffectiveDate().isAfter(now))
                    .max(Comparator.comparing(PricingPolicy::getEffectiveDate))
                    .orElseThrow(() -> new BusinessRuleViolationException(
                            "Không tìm thấy chính sách giá hiệu lực cho loại phương tiện này tại thời điểm hiện tại."));

            expectedAmount = latestPolicy.getBasePrice();
        }

        // So sánh chính xác 100%
        if (dto.getAmount().compareTo(expectedAmount) != 0) {
            throw new BusinessRuleViolationException(
                    "Số tiền thanh toán không khớp với định mức quy định của bãi xe.");
        }
    }

    /**
     * E3: Validate Overpayment Violation.
     * Kiểm tra tổng tiền thanh toán không vượt quá total_fee của lượt gửi xe.
     */
    private void validateOverpayment(PaymentRequestDTO dto, ParkingSession session) {
        if (session.getTotalFee() == null) {
            throw new BusinessRuleViolationException(
                    "Lượt gửi xe chưa được tính phí (total_fee chưa có giá trị).");
        }

        BigDecimal sumPaid = paymentCustomRepository.sumSuccessfulAmountBySessionId(session.getId());
        BigDecimal remainingDebt = session.getTotalFee().subtract(sumPaid);

        if (dto.getAmount().compareTo(remainingDebt) > 0) {
            throw new BusinessRuleViolationException(
                    "Không thể thực hiện giao dịch. Tổng số tiền các đợt thanh toán vượt quá chi phí lượt gửi.");
        }
    }

    /**
     * Parse fee_type string to FeeType enum.
     */
    private FeeType parseFeeType(String feeType) {
        try {
            return FeeType.valueOf(feeType);
        } catch (IllegalArgumentException e) {
            throw new BusinessRuleViolationException(
                    "Loại phí '" + feeType + "' không hợp lệ. Các giá trị hợp lệ: Parking_Fee, Booking_Deposit, Lost_Ticket_Fine.");
        }
    }

    /**
     * Parse payment_method string to PaymentMethod enum.
     */
    private PaymentMethod parsePaymentMethod(String method) {
        try {
            return PaymentMethod.valueOf(method);
        } catch (IllegalArgumentException e) {
            throw new BusinessRuleViolationException(
                    "Phương thức thanh toán '" + method + "' không hợp lệ. Các giá trị hợp lệ: Cash, Momo, Vnpay, Credit_Card.");
        }
    }

    /**
     * Map Payment entity to PaymentResponseDTO.
     */
    private PaymentResponseDTO mapToResponseDTO(Payment payment) {
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .parkingSessionId(payment.getParkingSession() != null ? payment.getParkingSession().getId() : null)
                .bookingId(payment.getBooking() != null ? payment.getBooking().getId() : null)
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .feeType(payment.getFeeType())
                .paymentTime(payment.getPaymentTime() != null
                        ? payment.getPaymentTime().format(RESPONSE_DATE_FORMAT)
                        : null)
                .status(payment.getStatus().name())
                .build();
    }
}
