package vn.edu.ut.pbms.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.pbms.constant.ParkingSessionStatus;
import vn.edu.ut.pbms.constant.PaymentStatus;
import vn.edu.ut.pbms.dto.request.ExceptionRequestDTOs.*;
import vn.edu.ut.pbms.dto.response.InvoiceDTO;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.entity.Payment;
import vn.edu.ut.pbms.exception.LicensePlateMismatchException;
import vn.edu.ut.pbms.exception.PaymentRequiredException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.service.ParkingSessionService;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ParkingSessionServiceImpl implements ParkingSessionService {

    @Autowired
    private ParkingSessionRepository parkingSessionRepository;

    // =========================================================================
    // PHẦN CODE EXCEPTION HANDLING (XỬ LÝ SỰ CỐ)
    // =========================================================================

    @Override
    @Transactional
    public InvoiceDTO resolveLostTicket(Long sessionId, LostTicketRequest request) {
        // 1. Lấy thông tin phiên đỗ xe từ Database
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lượt gửi xe với ID: " + sessionId));

        // 2. Tính toán tiền (Tạm tính theo giờ, sau này team có PricingPolicy thì gọi
        // sang)
        long hours = Duration.between(session.getTimeIn(), LocalDateTime.now()).toHours();
        if (hours == 0)
            hours = 1;
        BigDecimal baseFee = new BigDecimal(hours * 10000); // Tạm tính 10k/giờ
        BigDecimal penaltyFee = new BigDecimal("50000"); // 50k phạt mất thẻ

        BigDecimal totalFee = baseFee.add(penaltyFee);

        // 3. Cập nhật Entity và lưu Database
        // Giả định ParkingSessionStatus có trạng thái LOST_TICKET, nếu không bạn có thể
        // dùng trạng thái khác của team
        // session.setStatus(ParkingSessionStatus.LOST_TICKET);
        session.setTotalFee(totalFee);
        parkingSessionRepository.save(session);

        // 4. Trả về Hóa đơn
        return InvoiceDTO.builder()
                .baseFee(baseFee)
                .overtimeFee(BigDecimal.ZERO)
                .penaltyFee(penaltyFee)
                .totalFee(totalFee)
                .message("Đã xử lý mất vé. Yêu cầu thanh toán để ra cổng.")
                .build();
    }

    @Override
    public void processCheckoutValidation(Long sessionId, CheckoutRequest request) {
        // 1. Lấy thông tin xe lúc vào từ Database
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lượt gửi xe với ID: " + sessionId));

        String plateInDb = session.getPlate(); // Lấy thuộc tính plate từ Entity của team

        // 2. So khớp biển số
        if (!plateInDb.equalsIgnoreCase(request.getPlateOut())) {
            // Ném lỗi 409 Conflict ra cho GlobalExceptionHandler xử lý
            throw new LicensePlateMismatchException("Biển số ra (" + request.getPlateOut() +
                    ") không khớp với biển số vào (" + plateInDb + "). Chặn mở barrier.");
        }
    }

    @Override
    @Transactional
    public String overrideCheckout(Long sessionId, OverrideCheckoutRequest request) {
        // 1. Tìm phiên đỗ xe
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lượt gửi xe với ID: " + sessionId));

        // 2. Ép đóng phiên đỗ xe, cho qua lỗi
        // Giả định ParkingSessionStatus có trạng thái COMPLETED
        // session.setStatus(ParkingSessionStatus.COMPLETED);
        session.setTimeOut(LocalDateTime.now());

        parkingSessionRepository.save(session);

        // (Tùy chọn): Có thể tạo Entity OverrideLog để lưu request.getStaffId() và
        // request.getOverrideReason()

        return "Đã xác nhận đúng xe bằng mắt thường. Barrier mở.";
    }

    @Override
    public InvoiceDTO calculateFee(Long sessionId) {
        // 1. Lấy phiên đỗ xe
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lượt gửi xe với ID: " + sessionId));

        // 2. Tính toán dựa trên thời gian thực tế (timeIn)
        long hours = Duration.between(session.getTimeIn(), LocalDateTime.now()).toHours();
        if (hours == 0)
            hours = 1;

        // Giả lập logic tính lố giờ (Sau này thay bằng logic PricingPolicy)
        BigDecimal baseFee = new BigDecimal("30000");
        BigDecimal overtimeFee = BigDecimal.ZERO;

        if (hours > 4) {
            overtimeFee = new BigDecimal((hours - 4) * 10000); // Lố sau 4 tiếng, thu thêm 10k/tiếng
        }

        BigDecimal total = baseFee.add(overtimeFee);

        // 3. Cập nhật totalFee vào DB
        session.setTotalFee(total);
        parkingSessionRepository.save(session);

        return InvoiceDTO.builder()
                .baseFee(baseFee)
                .overtimeFee(overtimeFee)
                .penaltyFee(BigDecimal.ZERO)
                .totalFee(total)
                .message("Tính phí thành công.")
                .build();
    }

    @Override
    public void validateExitGate(Long sessionId) {
        // 1. Lấy phiên đỗ xe kèm danh sách Payment (Quan hệ @OneToMany đã được map
        // trong Entity)
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lượt gửi xe với ID: " + sessionId));

        List<Payment> payments = session.getPayments();

        // 2. Kiểm tra nghiệp vụ thanh toán
        if (payments == null || payments.isEmpty()) {
            throw new PaymentRequiredException(
                    "Lượt gửi xe chưa có giao dịch thanh toán nào. Vui lòng thanh toán trước khi ra cổng.");
        }

        // Kiểm tra xem có giao dịch nào đang bị treo (PENDING) không
        boolean hasPending = payments.stream()
                .anyMatch(payment -> payment.getStatus() == PaymentStatus.PENDING);

        if (hasPending) {
            throw new PaymentRequiredException(
                    "Có giao dịch đang chờ xử lý (PENDING). Vui lòng hoàn tất thanh toán hoặc nạp thêm tiền.");
        }

        // (Tùy chọn nâng cao): Tính tổng các Payment có trạng thái SUCCESS xem đã bằng
        // totalFee của Session chưa
        // BigDecimal totalPaid = payments.stream()
        // .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
        // .map(Payment::getAmount)
        // .reduce(BigDecimal.ZERO, BigDecimal::add);
        // if (session.getTotalFee() != null &&
        // totalPaid.compareTo(session.getTotalFee()) < 0) {
        // throw new PaymentRequiredException("Số tiền đã thanh toán chưa đủ. Vui lòng
        // thanh toán phần còn thiếu.");
        // }
    }
}