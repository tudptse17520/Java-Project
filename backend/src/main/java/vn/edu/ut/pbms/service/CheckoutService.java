package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.*;
import vn.edu.ut.pbms.dto.response.CheckOutResponse;
import vn.edu.ut.pbms.dto.response.FeeCalculationResponse;


/**
 * Interface định nghĩa các nghiệp vụ xử lý xe ra bãi (Check-out).
 */
public interface CheckoutService {

    /**
     * Xác thực biển số xe ở cổng ra.
     * So sánh biển số lúc ra và lúc vào.
     *
     * @param sessionId mã phiên gửi xe
     * @param request   chứa biển số ra và ảnh chụp
     */
    void validatePlate(Long sessionId, PlateValidationRequest request);

    /**
     * Nhân viên xác nhận ghi đè lỗi sai biển số để cho phép xe ra bãi.
     *
     * @param sessionId mã phiên gửi xe
     * @param request   chứa lý do và mã nhân viên
     * @return CheckOutResponse thông tin phiên đã hoàn tất
     */
    CheckOutResponse overrideCheckout(Long sessionId, OverrideCheckoutRequest request);

    /**
     * Tính toán cước phí gửi xe tại thời điểm hiện tại.
     *
     * @param sessionId mã phiên gửi xe
     * @return FeeCalculationResponse chi tiết cước phí
     */
    FeeCalculationResponse calculateFee(Long sessionId);

    /**
     * Xử lý báo mất vé gửi xe, tính cước phí và cộng thêm tiền phạt.
     *
     * @param sessionId mã phiên gửi xe
     * @param request   chứa thông tin nhân viên và ghi chú
     * @return FeeCalculationResponse thông tin cước và tiền phạt
     */
    FeeCalculationResponse processLostTicket(Long sessionId, LostTicketRequest request);



    /**
     * Kiểm tra điều kiện thanh toán tại cổng ra trước khi mở barrier.
     *
     * @param sessionId mã phiên gửi xe
     */
    void checkExitGate(Long sessionId);

    /**
     * Xác nhận xe ra bãi hoàn tất, đóng phiên gửi xe và giải phóng slot đỗ.
     *
     * @param sessionId mã phiên gửi xe
     * @param request   chứa thời gian ra bãi
     * @return CheckOutResponse thông tin kết quả checkout
     */
    CheckOutResponse checkOut(Long sessionId, CheckOutRequest request);
}
