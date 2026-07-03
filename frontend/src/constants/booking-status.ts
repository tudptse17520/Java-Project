// ---------------------------------------------
// Booking Status Constants
// Trạng thái đơn đặt chỗ trước
// ---------------------------------------------

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "Chờ xác nhận",
  [BookingStatus.CONFIRMED]: "Đã xác nhận",
  [BookingStatus.CHECKED_IN]: "Đã check-in",
  [BookingStatus.CANCELLED]: "Đã hủy",
  [BookingStatus.EXPIRED]: "Hết hạn",
};
