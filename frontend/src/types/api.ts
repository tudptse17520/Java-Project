// ---------------------------------------------
// API Response Types
// Kiểu dữ liệu chuẩn hóa từ Spring Boot Backend
// ---------------------------------------------

/**
 * Cấu trúc response chuẩn từ Backend
 * Matching Spring Boot: { status, message, data }
 */
export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

/**
 * Response lỗi từ Backend
 * Matching Spring Boot ErrorResponse: { status, error, message }
 */
export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
}
