// ---------------------------------------------
// Pagination Types
// Kiểu dữ liệu phân trang chung
// ---------------------------------------------

/**
 * Tham số phân trang gửi lên Backend
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
}

/**
 * Cấu trúc response phân trang từ Spring Boot
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
