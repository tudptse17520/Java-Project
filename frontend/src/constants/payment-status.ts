// ---------------------------------------------
// Payment Status Constants
// Trạng thái giao dịch thanh toán
// ---------------------------------------------

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.SUCCESS]: "Thành công",
  [PaymentStatus.FAILED]: "Thất bại",
};
