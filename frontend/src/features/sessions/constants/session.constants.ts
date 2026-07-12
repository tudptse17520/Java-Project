export const SESSION_QUERY_KEYS = {
  all: ["sessions"] as const,
  list: (filters: Record<string, any>) => ["sessions", "list", filters] as const,
  detail: (id: number) => ["sessions", "detail", id] as const,
};

export const CHECKOUT_MESSAGES = {
  SUCCESS: "Check-out hoàn tất thành công",
  EXIT_GATE_SUCCESS: "Đã thanh toán đầy đủ. Mở barrier.",
  OVERRIDE_SUCCESS: "Đã ghi đè lỗi và cho phép xe ra bãi",
  LOST_TICKET_SUCCESS: "Đã ghi nhận sự cố mất vé và tính phí",
  VALIDATION_SUCCESS: "Biển số trùng khớp",
  VALIDATION_ERROR: "Biển số xe ra không khớp với biển số lúc vào",
  PAYMENT_REQUIRED: "Xe chưa thanh toán đủ phí",
};
