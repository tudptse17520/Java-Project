// ---------------------------------------------
// Pricing Policy Types
// Kiểu dữ liệu cho chức năng quản lý bảng giá
// ---------------------------------------------

/**
 * Response DTO từ Backend khi lấy danh sách bảng giá
 */
export interface PricingPolicy {
  id: number;
  vehicleTypeId: number;
  vehicleTypeName?: string;
  basePrice: number;
  extraFeePerHour: number;
  effectiveDate: string; // Format: DD-MM-YYYY
  status?: string;
}

/**
 * Request DTO gửi lên Backend khi tạo mới / cập nhật bảng giá
 */
export interface PricingPolicyRequest {
  vehicleTypeId: number;
  basePrice: number;
  extraFeePerHour: number;
  effectiveDate: string; // Format: DD-MM-YYYY
}
