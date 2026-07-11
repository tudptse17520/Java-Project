// ---------------------------------------------
// Payment Constants (Feature-level)
// Hằng số dùng riêng cho feature thanh toán
// ---------------------------------------------

/**
 * Danh sách phương thức thanh toán (kèm label tiếng Việt)
 */
export const PAYMENT_METHODS = [
  { value: "Cash", label: "Tiền mặt" },
  { value: "Momo", label: "Ví MoMo" },
  { value: "Vnpay", label: "VNPay" },
] as const;

/**
 * Danh sách loại phí (kèm label tiếng Việt)
 */
export const FEE_TYPES = [
  { value: "PARKING_FEE", label: "Phí gửi xe" },
  { value: "LOST_TICKET_FINE", label: "Phạt mất vé" },
  { value: "BOOKING_DEPOSIT", label: "Cọc đặt chỗ" },
] as const;

/**
 * Trạng thái cho phép Staff cập nhật thủ công
 */
export const MANUAL_STATUS_OPTIONS = [
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
] as const;

/**
 * Label mapping cho phương thức thanh toán
 */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  Cash: "Tiền mặt",
  Momo: "Ví MoMo",
  Vnpay: "VNPay",
};

/**
 * Label mapping cho loại phí
 */
export const FEE_TYPE_LABELS: Record<string, string> = {
  PARKING_FEE: "Phí gửi xe",
  LOST_TICKET_FINE: "Phạt mất vé",
  BOOKING_DEPOSIT: "Cọc đặt chỗ",
};
