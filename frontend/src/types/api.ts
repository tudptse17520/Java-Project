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
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string>;
}
