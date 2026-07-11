// ---------------------------------------------
// Pricing Policy Types
// Kiểu dữ liệu cho chức năng quản lý bảng giá
// ---------------------------------------------

/**
 * Response DTO từ Backend khi lấy danh sách bảng giá
 */
export interface PricingPolicy {
  id: number;
  vehicle_type_id: number;
  vehicle_type_name?: string;
  base_price: number;
  extra_fee_per_hour: number;
  effective_date: string; // Format: DD-MM-YYYY
  status?: string;
}

/**
 * Request DTO gửi lên Backend khi tạo mới / cập nhật bảng giá
 */
export interface PricingPolicyRequest {
  vehicle_type_id: number;
  base_price: number;
  extra_fee_per_hour: number;
  effective_date: string; // Format: DD-MM-YYYY
}
