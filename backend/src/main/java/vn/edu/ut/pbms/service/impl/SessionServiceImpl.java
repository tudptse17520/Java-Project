// package vn.edu.ut.pbms.service.impl;

// import org.springframework.stereotype.Service;
// import vn.edu.ut.pbms.dto.request.ExceptionRequestDTOs.*;
// import vn.edu.ut.pbms.dto.response.InvoiceDTO;
// import vn.edu.ut.pbms.exception.LicensePlateMismatchException;
// import vn.edu.ut.pbms.exception.PaymentRequiredException;
// import vn.edu.ut.pbms.repository.BuildingRepository;
// import vn.edu.ut.pbms.service.SessionService;

// import java.math.BigDecimal;

// @Service
// public class SessionServiceImpl implements SessionService {

// private final BuildingRepository buildingRepository;

// SessionServiceImpl(BuildingRepository buildingRepository) {
// this.buildingRepository = buildingRepository;
// }

// @Override
// public InvoiceDTO resolveLostTicket(Long sessionId, LostTicketRequest
// request) {
// // Giả lập lấy data từ DB
// BigDecimal baseFee = new BigDecimal("10000"); // 10k phí gốc
// BigDecimal penaltyFee = new BigDecimal("50000"); // 50k phạt mất thẻ

// // TODO: Cập nhật status của Session thành LOST_TICKET dưới DB

// return InvoiceDTO.builder()
// .baseFee(baseFee)
// .overtimeFee(BigDecimal.ZERO)
// .penaltyFee(penaltyFee)
// .totalFee(baseFee.add(penaltyFee))
// .message("Đã xử lý mất vé. Yêu cầu thanh toán để ra cổng.")
// .build();
// }

// @Override
// public void processCheckoutValidation(Long sessionId, CheckoutRequest
// request) {
// // Giả lập dữ liệu trong DB
// String plateInDb = "59A-12345";

// if (!plateInDb.equalsIgnoreCase(request.getPlateOut())) {
// // Đạp thắng: Quăng lỗi 409 ra cho GlobalExceptionHandler bọc lại
// throw new LicensePlateMismatchException("Biển số ra (" +
// request.getPlateOut()
// + ") không khớp với biển số vào (" + plateInDb + "). Chặn mở barrier.");
// }
// // Tiếp tục luồng checkout bình thường nếu hợp lệ...
// }

// @Override
// public String overrideCheckout(Long sessionId, OverrideCheckoutRequest
// request) {
// // TODO: Lưu log staffId và overrideReason vào DB để truy vết sau này
// // TODO: Đóng phiên đỗ xe (Chuyển status -> COMPLETED)
// return "Đã xác nhận đúng xe bằng mắt thường. Barrier mở.";
// }

// @Override
// public InvoiceDTO calculateFee(Long sessionId) {
// // Tính toán logic đỗ quá giờ
// BigDecimal baseFee = new BigDecimal("30000"); // Vé gốc
// BigDecimal overtimeFee = new BigDecimal("15000"); // Phụ thu lố giờ

// return InvoiceDTO.builder()
// .baseFee(baseFee)
// .overtimeFee(overtimeFee)
// .penaltyFee(BigDecimal.ZERO)
// .totalFee(baseFee.add(overtimeFee))
// .message("Tính phí thành công (Bao gồm phí đỗ quá giờ).")
// .build();
// }

// @Override
// public void validateExitGate(Long sessionId) {
// // Giả lập kiểm tra trạng thái thanh toán
// String paymentStatus = "PENDING";

// if ("PENDING".equals(paymentStatus) || "UNPAID".equals(paymentStatus)) {
// // Quăng lỗi 402 yêu cbuildingRepositoryầu thanh toán
// throw new PaymentRequiredException(
// "Lượt gửi xe chưa được thanh toán hoặc số dư không đủ. Vui lòng thanh toán
// trước khi ra cổng.");
// }
// // Lệnh kích hoạt mở Barrier
// }
// }