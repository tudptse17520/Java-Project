// ---------------------------------------------
// Payment Types
// Kiểu dữ liệu cho chức năng thanh toán
// ---------------------------------------------

/**
 * Response DTO từ Backend khi lấy chi tiết / item trong danh sách giao dịch.
 * Map 1:1 với PaymentResponseDTO.java
 */
export interface Payment {
  id: number;
  parkingSessionId: number | null;
  bookingId: number | null;
  amount: number;
  paymentMethod: string;
  feeType: string;
  paymentTime: string;
  status: string;
  payment_url?: string;
}

/**
 * Wrapper response từ Backend khi GET danh sách giao dịch.
 * Map 1:1 với PaymentListResponseDTO.java
 */
export interface PaymentListResponse {
  totalItems: number;
  message: string;
  data: Payment[];
}

/**
 * Request DTO gửi lên Backend để tạo thanh toán mới.
 * Map 1:1 với PaymentRequestDTO.java
 */
export interface PaymentRequest {
  parkingSessionId?: number | null;
  bookingId?: number | null;
  amount: number;
  paymentMethod: string;
  feeType: string;
}

/**
 * Request DTO cho Staff cập nhật trạng thái thủ công.
 * Map 1:1 với ManualStatusRequestDTO.java
 */
export interface ManualStatusRequest {
  status: string;
  note: string;
}

/**
 * Bộ lọc cho GET danh sách giao dịch (Query Parameters).
 */
export interface PaymentFilter {
  paymentMethod?: string;
  status?: string;
  fromDate?: string;
  plate?: string;
  feeType?: string;
}
