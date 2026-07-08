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
  parking_session_id: number | null;
  booking_id: number | null;
  amount: number;
  payment_method: string;
  fee_type: string;
  payment_time: string;
  status: string;
}

/**
 * Wrapper response từ Backend khi GET danh sách giao dịch.
 * Map 1:1 với PaymentListResponseDTO.java
 */
export interface PaymentListResponse {
  total_items: number;
  message: string;
  data: Payment[];
}

/**
 * Request DTO gửi lên Backend để tạo thanh toán mới.
 * Map 1:1 với PaymentRequestDTO.java
 */
export interface PaymentRequest {
  parking_session_id?: number | null;
  booking_id?: number | null;
  amount: number;
  payment_method: string;
  fee_type: string;
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
  payment_method?: string;
  status?: string;
  from_date?: string;
}
