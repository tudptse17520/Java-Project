package vn.edu.ut.pbms.constant;

/**
 * Status enum for Booking entity.
 * PENDING = chờ xác nhận, CONFIRMED = đã xác nhận,
 * CHECKED_IN = đã check-in, CANCELLED = đã hủy, EXPIRED = đã hết hạn.
 */
public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CHECKED_IN,
    CANCELLED,
    EXPIRED
}
