package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.*;
import vn.edu.ut.pbms.dto.request.*;
import vn.edu.ut.pbms.dto.response.CheckOutResponse;
import vn.edu.ut.pbms.dto.response.FeeCalculationResponse;
import vn.edu.ut.pbms.dto.response.PaymentResponse;
import vn.edu.ut.pbms.entity.*;
import vn.edu.ut.pbms.exception.*;
import vn.edu.ut.pbms.repository.*;
import vn.edu.ut.pbms.service.CheckoutService;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Lớp hiện thực các nghiệp vụ xử lý xe ra bãi (Check-out).
 */
@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final ParkingSessionRepository parkingSessionRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final PaymentRepository paymentRepository;
    private final PricingPolicyRepository pricingPolicyRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    // Tiền phạt mất thẻ xe cố định: 100,000 VNĐ
    private static final BigDecimal LOST_TICKET_FINE_AMOUNT = new BigDecimal("100000.00");

    // Số giờ đỗ xe trong block đầu tiên mặc định: 4 giờ
    private static final long BASE_HOURS = 4;

    @Override
    @Transactional
    public void validatePlate(Long sessionId, PlateValidationRequest request) {
        ParkingSession session = getActiveSession(sessionId);

        // Chuẩn hóa biển số xe để so sánh (loại bỏ khoảng trắng, dấu gạch ngang, chuyển chữ thường)
        String cleanPlateIn = session.getPlate().replaceAll("[\\s\\-]", "").toLowerCase();
        String cleanPlateOut = request.getPlateOut().replaceAll("[\\s\\-]", "").toLowerCase();

        if (!cleanPlateIn.equals(cleanPlateOut)) {
            // Tạo biên bản ghi nhận sự cố sai biển số
            Feedback feedback = Feedback.builder()
                    .issueType(IssueType.WRONG_PLATE)
                    .description("Xác thực biển số thất bại ở cổng ra. Biển số nhận diện lúc ra: " 
                            + request.getPlateOut() + " (Ảnh: " + request.getPlateOutImage() 
                            + ") khác với biển số lúc vào: " + session.getPlate() + ".")
                    .status(FeedbackStatus.REPORTED)
                    .parkingSession(session)
                    .build();
            feedbackRepository.save(feedback);

            throw new LicensePlateMismatchException("Biển số xe ra không khớp với biển số xe lúc vào bãi.");
        }
    }

    @Override
    @Transactional
    public CheckOutResponse overrideCheckout(Long sessionId, OverrideCheckoutRequest request) {
        ParkingSession session = getActiveSession(sessionId);

        // Kiểm tra sự tồn tại của nhân viên
        User staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên xác nhận không tồn tại."));

        if (staff.getRole() == Role.USER) {
            throw new BusinessRuleViolationException("Tài khoản khách hàng không có quyền thực hiện thao tác này.");
        }

        // Tạo feedback ghi nhận sự kiện override thành công
        Feedback feedback = Feedback.builder()
                .issueType(IssueType.WRONG_PLATE)
                .description("Nhân viên (ID: " + staff.getId() + ", Tên: " + staff.getFullName() 
                        + ") đã phê duyệt ghi đè lỗi sai biển số. Lý do: " + request.getOverrideReason())
                .status(FeedbackStatus.RESOLVED)
                .parkingSession(session)
                .build();
        feedbackRepository.save(feedback);

        // Cập nhật trạng thái các feedback WRONG_PLATE cũ của session này thành RESOLVED
        if (session.getFeedbacks() != null) {
            for (Feedback fb : session.getFeedbacks()) {
                if (fb.getIssueType() == IssueType.WRONG_PLATE && fb.getStatus() != FeedbackStatus.RESOLVED) {
                    fb.setStatus(FeedbackStatus.RESOLVED);
                    feedbackRepository.save(fb);
                }
            }
        }

        // Thực hiện đóng phiên gửi xe ngay lập tức khi được nhân viên ghi đè
        LocalDateTime now = LocalDateTime.now();
        session.setTimeOut(now);
        session.setStatus(ParkingSessionStatus.COMPLETED);
        
        // Nếu chưa tính phí trước đó, gán phí gửi xe bằng cước phí hiện tại hoặc mặc định là 0
        if (session.getTotalFee() == null) {
            try {
                BigDecimal calculatedFee = calculateParkingFee(session, now).getTotalFee();
                session.setTotalFee(calculatedFee);
            } catch (Exception e) {
                session.setTotalFee(BigDecimal.ZERO);
            }
        }
        
        parkingSessionRepository.save(session);

        // Giải phóng ô đỗ xe
        if (session.getParkingSlot() != null) {
            ParkingSlot slot = session.getParkingSlot();
            slot.setStatus(ParkingSlotStatus.AVAILABLE);
            parkingSlotRepository.save(slot);
        }

        return CheckOutResponse.builder()
                .sessionId(session.getId())
                .timeIn(session.getTimeIn())
                .timeOut(session.getTimeOut())
                .totalFee(session.getTotalFee())
                .status(session.getStatus())
                .message("Nhân viên đã phê duyệt cho xe ra bãi thành công.")
                .build();
    }

    @Override
    @Transactional
    public FeeCalculationResponse calculateFee(Long sessionId) {
        ParkingSession session = getActiveSession(sessionId);
        FeeCalculationResponse response = calculateParkingFee(session, LocalDateTime.now());

        // Cập nhật cước phí dự kiến vào phiên gửi xe
        session.setTotalFee(response.getTotalFee());
        parkingSessionRepository.save(session);

        return response;
    }

    @Override
    @Transactional
    public FeeCalculationResponse processLostTicket(Long sessionId, LostTicketRequest request) {
        ParkingSession session = getActiveSession(sessionId);

        // Kiểm tra nhân viên xác nhận
        User staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên xác nhận không tồn tại."));

        if (staff.getRole() == Role.USER) {
            throw new BusinessRuleViolationException("Tài khoản khách hàng không có quyền thực hiện thao tác này.");
        }

        // Tính cước phí gửi xe thực tế đến thời điểm hiện tại
        LocalDateTime now = LocalDateTime.now();
        FeeCalculationResponse baseFeeResponse = calculateParkingFee(session, now);

        BigDecimal baseFee = baseFeeResponse.getBaseFee();
        BigDecimal overtimeFee = baseFeeResponse.getOvertimeFee();
        BigDecimal totalFee = baseFeeResponse.getTotalFee().add(LOST_TICKET_FINE_AMOUNT);

        // Tạo biên bản ghi nhận sự cố mất vé xe
        Feedback feedback = Feedback.builder()
                .issueType(IssueType.LOST_TICKET)
                .description("Nhân viên (ID: " + staff.getId() + ") ghi nhận xe báo mất thẻ gửi xe. Ghi chú: " + request.getNote())
                .status(FeedbackStatus.PROCESSING)
                .parkingSession(session)
                .build();
        feedbackRepository.save(feedback);

        // Cập nhật tổng số tiền cần thanh toán của session (đã bao gồm tiền phạt)
        session.setTotalFee(totalFee);
        parkingSessionRepository.save(session);

        return FeeCalculationResponse.builder()
                .baseFee(baseFee)
                .overtimeFee(overtimeFee)
                .penaltyFee(LOST_TICKET_FINE_AMOUNT)
                .totalFee(totalFee)
                .message("Đã ghi nhận mất thẻ xe. Tổng chi phí bao gồm tiền phạt mất thẻ: " + LOST_TICKET_FINE_AMOUNT + " VNĐ.")
                .build();
    }

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        ParkingSession session = getActiveSession(request.getParkingSessionId());

        Booking booking = null;
        if (request.getBookingId() != null) {
            // Giả định có BookingRepository để tìm booking, tạm thời xử lý nullable hoặc kiểm tra nếu cần
            // Ở đây để giữ tính đơn giản, ta chỉ gán Booking khi cần, hoặc không cần kiểm tra chặt chẽ booking
            // hoặc nếu cần có thể inject BookingRepository. Nhưng trong repository list không có BookingRepository.
            // Ta có thể bỏ qua kiểm tra booking hoặc chỉ lấy từ session nếu có.
            if (session.getBooking() != null && session.getBooking().getId().equals(request.getBookingId())) {
                booking = session.getBooking();
            }
        }

        // Lưu thông tin giao dịch thanh toán (Mặc định thành công trực tiếp cho API mô phỏng)
        Payment payment = Payment.builder()
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentTime(LocalDateTime.now())
                .status(PaymentStatus.SUCCESS)
                .feeType(request.getFeeType())
                .parkingSession(session)
                .booking(booking)
                .build();
        payment = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentTime(payment.getPaymentTime())
                .status(payment.getStatus())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public void checkExitGate(Long sessionId) {
        ParkingSession session = getActiveSession(sessionId);
        validatePaymentStatus(session);
    }

    @Override
    @Transactional
    public CheckOutResponse checkOut(Long sessionId, CheckOutRequest request) {
        ParkingSession session = getActiveSession(sessionId);

        // 1. Kiểm tra điều kiện thanh toán đầy đủ
        validatePaymentStatus(session);

        // 2. Cập nhật thông tin phiên đỗ xe
        session.setTimeOut(request.getTimeOut());
        session.setStatus(ParkingSessionStatus.COMPLETED);
        
        // Nếu totalFee chưa được set hoặc lưu trước đó
        if (session.getTotalFee() == null) {
            BigDecimal finalFee = calculateParkingFee(session, request.getTimeOut()).getTotalFee();
            session.setTotalFee(finalFee);
        }
        
        parkingSessionRepository.save(session);

        // 3. Giải phóng slot đỗ xe thành AVAILABLE
        if (session.getParkingSlot() != null) {
            ParkingSlot slot = session.getParkingSlot();
            slot.setStatus(ParkingSlotStatus.AVAILABLE);
            parkingSlotRepository.save(slot);
        }

        // 4. Giải quyết các feedback chưa hoàn tất của phiên gửi này
        if (session.getFeedbacks() != null) {
            for (Feedback fb : session.getFeedbacks()) {
                if (fb.getStatus() != FeedbackStatus.RESOLVED) {
                    fb.setStatus(FeedbackStatus.RESOLVED);
                    feedbackRepository.save(fb);
                }
            }
        }

        return CheckOutResponse.builder()
                .sessionId(session.getId())
                .timeIn(session.getTimeIn())
                .timeOut(session.getTimeOut())
                .totalFee(session.getTotalFee())
                .status(session.getStatus())
                .message("Xử lý xe ra bãi hoàn tất. Cổng barrier đã mở.")
                .build();
    }

    /**
     * Hỗ trợ tìm kiếm phiên đỗ xe hoạt động (IN_PROGRESS) theo ID.
     */
    private ParkingSession getActiveSession(Long sessionId) {
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên gửi xe với ID: " + sessionId));

        if (session.getStatus() == ParkingSessionStatus.COMPLETED) {
            throw new BusinessRuleViolationException("Phiên gửi xe này đã hoàn tất check-out trước đó.");
        }
        return session;
    }

    /**
     * Tính toán chi phí đỗ xe thực tế dựa vào thời điểm gửi xe và chính sách giá.
     */
    private FeeCalculationResponse calculateParkingFee(ParkingSession session, LocalDateTime timeOut) {
        LocalDateTime timeIn = session.getTimeIn();
        if (timeOut.isBefore(timeIn)) {
            throw new BusinessRuleViolationException("Thời gian ra không được nhỏ hơn thời gian xe vào bãi.");
        }

        // Xác định VehicleType tương ứng
        VehicleType vehicleType = null;
        if (session.getVehicle() != null) {
            vehicleType = session.getVehicle().getVehicleType();
        } else if (session.getParkingSlot() != null && session.getParkingSlot().getFloor() != null) {
            vehicleType = session.getParkingSlot().getFloor().getVehicleType();
        }

        if (vehicleType == null) {
            throw new ResourceNotFoundException("Không xác định được loại phương tiện cho phiên gửi xe này.");
        }

        // Lấy chính sách giá khả dụng tại thời điểm check-in
        PricingPolicy policy = pricingPolicyRepository
                .findFirstByVehicleType_IdAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(vehicleType.getId(), timeIn)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chính sách giá phù hợp cho loại xe: " + vehicleType.getTypeName()));

        // Tính số giờ đỗ xe (làm tròn lên)
        long totalMinutes = Duration.between(timeIn, timeOut).toMinutes();
        if (totalMinutes < 0) totalMinutes = 0;
        long hoursRoundedUp = (long) Math.ceil(totalMinutes / 60.0);

        BigDecimal baseFee = policy.getBasePrice();
        BigDecimal overtimeFee = BigDecimal.ZERO;

        // Nếu vượt quá số giờ cơ bản, tính phí overtime
        if (hoursRoundedUp > BASE_HOURS) {
            long overtimeHours = hoursRoundedUp - BASE_HOURS;
            overtimeFee = policy.getExtraFeePerHour().multiply(BigDecimal.valueOf(overtimeHours));
        }

        BigDecimal totalFee = baseFee.add(overtimeFee);

        return FeeCalculationResponse.builder()
                .baseFee(baseFee)
                .overtimeFee(overtimeFee)
                .totalFee(totalFee)
                .message("Đã tính phí gửi xe thành công.")
                .build();
    }

    /**
     * Xác thực xem xe đã hoàn tất thanh toán phí gửi xe chưa.
     */
    private void validatePaymentStatus(ParkingSession session) {
        BigDecimal totalFee = session.getTotalFee();
        if (totalFee == null || totalFee.compareTo(BigDecimal.ZERO) == 0) {
            // Phiên gửi xe chưa được tính cước phí, hoặc cước phí bằng 0
            return;
        }

        // Tính tổng số tiền đã thanh toán thành công
        BigDecimal totalPaid = BigDecimal.ZERO;
        if (session.getPayments() != null) {
            totalPaid = session.getPayments().stream()
                    .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                    .map(Payment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        // Nếu tổng tiền thanh toán nhỏ hơn tổng cước phí yêu cầu
        if (totalPaid.compareTo(totalFee) < 0) {
            // Kiểm tra xem đã có feedback UNPAID_EXIT tương ứng chưa, nếu chưa thì tạo mới
            boolean hasFeedback = false;
            if (session.getFeedbacks() != null) {
                hasFeedback = session.getFeedbacks().stream()
                        .anyMatch(fb -> fb.getIssueType() == IssueType.UNPAID_EXIT && fb.getStatus() == FeedbackStatus.REPORTED);
            }

            if (!hasFeedback) {
                Feedback feedback = Feedback.builder()
                        .issueType(IssueType.UNPAID_EXIT)
                        .description("Xe cố gắng qua cổng ra nhưng chưa thanh toán đủ phí. Đã thanh toán: " 
                                + totalPaid + " VNĐ, Phải thanh toán: " + totalFee + " VNĐ.")
                        .status(FeedbackStatus.REPORTED)
                        .parkingSession(session)
                        .build();
                feedbackRepository.save(feedback);
            }

            throw new UnpaidExitException("Xe chưa thanh toán đầy đủ phí đỗ xe. Số tiền còn thiếu: " 
                    + totalFee.subtract(totalPaid) + " VNĐ. Vui lòng thanh toán trước khi rời bãi.");
        }
    }
}
