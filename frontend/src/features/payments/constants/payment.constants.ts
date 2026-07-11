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
  { value: "Parking_Fee", label: "Phí gửi xe" },
  { value: "Lost_Ticket_Fine", label: "Phạt mất vé" },
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
  Credit_Card: "Thẻ tín dụng",
};

/**
 * Label mapping cho loại phí
 */
export const FEE_TYPE_LABELS: Record<string, string> = {
  Parking_Fee: "Phí gửi xe",
  Lost_Ticket_Fine: "Phạt mất vé",
  PARKING_FEE: "Phí gửi xe",
  LOST_TICKET_FINE: "Phạt mất vé",
};
