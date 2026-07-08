package vn.edu.ut.pbms.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.config.VnpayConfig;
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
import vn.edu.ut.pbms.util.VnpayUtil;

/**
 * Implementation of PaymentService. Handles all payment business logic
 * including: - E2 (Fixed Fee Mismatch) validation for Booking_Deposit and
 * Lost_Ticket_Fine - E3 (Overpayment Violation) validation for Parking_Fee -
 * Cash auto-SUCCESS, electronic payment PENDING flow - Staff manual status
 * update with audit note validation - Payment cancellation
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentCustomRepository paymentCustomRepository;
    private final ParkingSessionRepository parkingSessionRepository;
    private final BookingRepository bookingRepository;
    private final VnpayConfig vnpayConfig;

    /**
     * Hằng số mức phạt mất vé mặc định (200.000đ). Áp dụng khi fee_type =
     * Lost_Ticket_Fine.
     */
    private static final BigDecimal DEFAULT_LOST_TICKET_FINE = new BigDecimal("200000");

    private static final DateTimeFormatter RESPONSE_DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    private static final DateTimeFormatter REQUEST_DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    // ==================== CREATE - Tạo thanh toán ====================
    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO, HttpServletRequest request) {
        // 1. Validate mutual exclusivity: phải có đúng 1 trong parkingSessionId hoặc bookingId
        validateMutualExclusivity(requestDTO);

        // 2. Validate fee_type enum
        FeeType feeType = parseFeeType(requestDTO.getFeeType());

        // 3. Validate cross-mapping: fee_type MUST match the provided ID type
        if (requestDTO.getBookingId() != null && feeType != FeeType.BOOKING_DEPOSIT) {
            throw new BusinessRuleViolationException(
                    "Giao dịch sai: Khi thanh toán cho đơn đặt chỗ (booking_id), loại phí bắt buộc phải là Booking_Deposit.");
        }
        if (requestDTO.getParkingSessionId() != null && feeType == FeeType.BOOKING_DEPOSIT) {
            throw new BusinessRuleViolationException(
                    "Giao dịch sai: Khi thanh toán cho lượt gửi xe (parking_session_id), loại phí không được là Booking_Deposit.");
        }

        // 4. Validate payment_method enum
        PaymentMethod paymentMethod = parsePaymentMethod(requestDTO.getPaymentMethod());

        // 4. E2 Check (Fixed Fee Mismatch) - Booking_Deposit hoặc Lost_Ticket_Fine
        if (feeType == FeeType.BOOKING_DEPOSIT || feeType == FeeType.LOST_TICKET_FINE) {
            validateFixedFeeMismatch(requestDTO, feeType);
        }

        // 5. E3 Check (Overpayment Violation) - Parking_Fee
        ParkingSession parkingSession = null;
        Booking booking = null;

        if (requestDTO.getParkingSessionId() != null) {
            parkingSession = parkingSessionRepository.findById(requestDTO.getParkingSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                    "Không tìm thấy lượt gửi xe với ID: " + requestDTO.getParkingSessionId()));

            if (feeType == FeeType.PARKING_FEE) {
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
                .feeType(feeType)
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

        PaymentResponseDTO responseDTO = mapToResponseDTO(savedPayment);

        // 9. Generate VNPAY URL if Vnpay method is selected
        if (paymentMethod == PaymentMethod.Vnpay) {
            String vnpayUrl = generateVnpayUrl(savedPayment, request);
            responseDTO.setPaymentUrl(vnpayUrl);
        }

        // 10. Auto-complete ParkingSession if fully paid (for Cash payments)
        if (savedPayment.getStatus() == PaymentStatus.SUCCESS && savedPayment.getParkingSession() != null) {
            checkAndCompleteParkingSession(savedPayment.getParkingSession());
        }

        return responseDTO;
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

    @Override
    @Transactional(readOnly = true)
    public vn.edu.ut.pbms.dto.response.PaymentDebtResponseDTO getRemainingDebt(Long sessionId) {
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lượt gửi xe với ID: " + sessionId));

        if (session.getTotalFee() == null) {
            throw new BusinessRuleViolationException("Lượt gửi xe chưa được tính phí (total_fee chưa có giá trị). Vui lòng gọi API calculate-fee bên Checkout trước.");
        }

        BigDecimal sumPaid = paymentCustomRepository.sumSuccessfulAmountBySessionId(session.getId());
        if (session.getBooking() != null) {
            sumPaid = sumPaid.add(paymentCustomRepository.sumSuccessfulAmountByBookingId(session.getBooking().getId()));
        }

        BigDecimal remainingDebt = session.getTotalFee().subtract(sumPaid);
        if (remainingDebt.compareTo(BigDecimal.ZERO) < 0) {
            remainingDebt = BigDecimal.ZERO;
        }

        return vn.edu.ut.pbms.dto.response.PaymentDebtResponseDTO.builder()
                .sessionId(session.getId())
                .totalFee(session.getTotalFee())
                .paidFee(sumPaid)
                .remainingFee(remainingDebt)
                .build();
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

        if (newStatus == PaymentStatus.SUCCESS && updatedPayment.getParkingSession() != null) {
            checkAndCompleteParkingSession(updatedPayment.getParkingSession());
        }

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

    // ==================== VNPAY IPN Webhook ====================
    @Override
    public ResponseEntity<String> processVnpayIpn(HttpServletRequest request) {
        try {
            Map<String, String> fields = new HashMap<>();
            for (java.util.Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && fieldValue.length() > 0) {
                    fields.put(fieldName, fieldValue);
                }
            }

            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            if (fields.containsKey("vnp_SecureHashType")) {
                fields.remove("vnp_SecureHashType");
            }
            if (fields.containsKey("vnp_SecureHash")) {
                fields.remove("vnp_SecureHash");
            }

            // Validate signature
            String signValue = VnpayUtil.hashAllFields(fields, vnpayConfig.getSecretKey());
            if (signValue.equals(vnp_SecureHash)) {
                boolean checkOrderId = true; // Payment ID exists in DB
                boolean checkAmount = true; // Amount matches DB
                boolean checkOrderStatus = true; // Status is PENDING

                Long paymentId = Long.parseLong(fields.get("vnp_TxnRef"));
                Payment payment = paymentRepository.findById(paymentId).orElse(null);

                if (payment == null) {
                    return ResponseEntity.ok("{\"RspCode\":\"01\",\"Message\":\"Order not found\"}");
                }

                // Check amount (VNPAY sends amount * 100)
                BigDecimal vnpAmount = new BigDecimal(fields.get("vnp_Amount")).divide(new BigDecimal("100"));
                if (payment.getAmount().compareTo(vnpAmount) != 0) {
                    return ResponseEntity.ok("{\"RspCode\":\"04\",\"Message\":\"Invalid amount\"}");
                }

                if (payment.getStatus() != PaymentStatus.PENDING) {
                    return ResponseEntity.ok("{\"RspCode\":\"02\",\"Message\":\"Order already confirmed\"}");
                }

                if ("00".equals(request.getParameter("vnp_ResponseCode"))) {
                    // Success
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setPaymentTime(LocalDateTime.now());
                } else {
                    // Failed
                    payment.setStatus(PaymentStatus.FAILED);
                }

                paymentRepository.save(payment);

                // If this payment was for a Booking, we should update the booking status to CONFIRMED
                if (payment.getStatus() == PaymentStatus.SUCCESS && payment.getBooking() != null) {
                    Booking booking = payment.getBooking();
                    booking.setStatus(vn.edu.ut.pbms.constant.BookingStatus.CONFIRMED);
                    bookingRepository.save(booking);
                }

                // If this payment was for a ParkingSession, check if fully paid to complete it
                if (payment.getStatus() == PaymentStatus.SUCCESS && payment.getParkingSession() != null) {
                    checkAndCompleteParkingSession(payment.getParkingSession());
                }

                return ResponseEntity.ok("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}");
            } else {
                return ResponseEntity.ok("{\"RspCode\":\"97\",\"Message\":\"Invalid Checksum\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("{\"RspCode\":\"99\",\"Message\":\"Unknown error\"}");
        }
    }

    // ==================== Private Helpers ====================
    private String generateVnpayUrl(Payment payment, HttpServletRequest request) {
        String vnp_Version = VnpayConfig.VNP_VERSION;
        String vnp_Command = VnpayConfig.VNP_COMMAND;
        String vnp_TxnRef = String.valueOf(payment.getId());
        String vnp_IpAddr = VnpayUtil.getIpAddress(request);
        String vnp_TmnCode = vnpayConfig.getVnpTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);

        // VNPAY expects amount * 100
        BigDecimal amountInVND = payment.getAmount().multiply(new BigDecimal("100"));
        vnp_Params.put("vnp_Amount", String.valueOf(amountInVND.longValue()));

        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);

        // Order Info
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");

        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        String queryUrl = VnpayUtil.getPaymentURL(vnp_Params, true);
        String hashData = VnpayUtil.getPaymentURL(vnp_Params, false);
        String vnp_SecureHash = VnpayUtil.hmacSHA512(vnpayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnpayConfig.getVnpPayUrl() + "?" + queryUrl;
    }

    /**
     * Validate rằng client phải truyền đúng 1 trong 2 tham số parkingSessionId
     * hoặc bookingId.
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
     * E2: Validate Fixed Fee Mismatch. Kiểm tra số tiền thanh toán phải khớp
     * 100% với mức niêm yết.
     */
    private void validateFixedFeeMismatch(PaymentRequestDTO dto, FeeType feeType) {
        BigDecimal expectedAmount;

        if (feeType == FeeType.LOST_TICKET_FINE) {
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
     * E3: Validate Overpayment Violation. Kiểm tra tổng tiền thanh toán không
     * vượt quá total_fee của lượt gửi xe.
     */
    private void validateOverpayment(PaymentRequestDTO dto, ParkingSession session) {
        if (session.getTotalFee() == null) {
            throw new BusinessRuleViolationException(
                    "Lượt gửi xe chưa được tính phí (total_fee chưa có giá trị).");
        }

        BigDecimal sumPaid = paymentCustomRepository.sumSuccessfulAmountBySessionId(session.getId());
        if (session.getBooking() != null) {
            sumPaid = sumPaid.add(paymentCustomRepository.sumSuccessfulAmountByBookingId(session.getBooking().getId()));
        }
        BigDecimal remainingDebt = session.getTotalFee().subtract(sumPaid);

        if (dto.getAmount().compareTo(remainingDebt) > 0) {
            throw new BusinessRuleViolationException(
                    "Không thể thực hiện giao dịch. Tổng số tiền các đợt thanh toán vượt quá chi phí lượt gửi.");
        }
    }

    /**
     * Tự động kiểm tra và chuyển trạng thái ParkingSession sang COMPLETED nếu
     * đã thanh toán đủ.
     */
    private void checkAndCompleteParkingSession(ParkingSession session) {
        if (session.getTotalFee() == null || session.getStatus() == vn.edu.ut.pbms.constant.ParkingSessionStatus.COMPLETED) {
            return;
        }

        BigDecimal sumPaid = paymentCustomRepository.sumSuccessfulAmountBySessionId(session.getId());
        if (session.getBooking() != null) {
            sumPaid = sumPaid.add(paymentCustomRepository.sumSuccessfulAmountByBookingId(session.getBooking().getId()));
        }
        BigDecimal remainingDebt = session.getTotalFee().subtract(sumPaid);

        if (remainingDebt.compareTo(BigDecimal.ZERO) <= 0) {
            session.setStatus(vn.edu.ut.pbms.constant.ParkingSessionStatus.COMPLETED);
            parkingSessionRepository.save(session);
        }
    }

    /**
     * Parse fee_type string to FeeType enum.
     */
    private FeeType parseFeeType(String feeType) {
        try {
            return FeeType.valueOf(feeType.toUpperCase());
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
                .feeType(payment.getFeeType().name())
                .paymentTime(payment.getPaymentTime() != null
                        ? payment.getPaymentTime().format(RESPONSE_DATE_FORMAT)
                        : null)
                .status(payment.getStatus().name())
                .build();
    }
}
