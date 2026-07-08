package vn.edu.ut.pbms.constant;

import java.math.BigDecimal;

/**
 * Hằng số hệ thống tập trung cho toàn bộ ứng dụng PBMS.
 */
public final class Constants {

    private Constants() {
        // Prevent instantiation
    }

    // ==================== Parking Fee ====================

    /**
     * Mức phí phạt mất thẻ/vé xe cố định: 200,000 VNĐ.
     * Áp dụng cho cả CheckoutServiceImpl và PaymentServiceImpl.
     */
    public static final BigDecimal DEFAULT_LOST_TICKET_FINE = new BigDecimal("200000");

    /**
     * Số giờ đỗ xe trong block đầu tiên mặc định: 4 giờ.
     * Sau 4 giờ sẽ tính phí phụ thu (overtime) theo chính sách giá.
     */
    public static final long BASE_PARKING_HOURS = 4;
}
