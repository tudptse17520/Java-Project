package vn.edu.ut.pbms.constant;

/**
 * Tập trung hóa tất cả thông báo (success / error) cho module Quản lý bảng giá.
 * Theo yêu cầu Refactor Phase 2 – Section 8.
 */
public final class MessageConstants {

    private MessageConstants() {
        // Prevent instantiation
    }

    // ==================== PricingPolicy - Success ====================
    public static final String PRICING_POLICY_LIST_SUCCESS = "Lấy danh sách bảng giá thành công";
    public static final String PRICING_POLICY_CREATE_SUCCESS = "Thêm mới bảng giá thành công";
    public static final String PRICING_POLICY_UPDATE_SUCCESS = "Cập nhật bảng giá thành công";
    public static final String PRICING_POLICY_DELETE_SUCCESS = "Bảng giá không còn hiệu lực";

    // ==================== PricingPolicy - Error ====================
    /**
     * E1 - Bỏ trống thông tin bắt buộc
     */
    public static final String PRICING_POLICY_VEHICLE_TYPE_REQUIRED = "Danh mục loại xe không được để trống.";
    public static final String PRICING_POLICY_BASE_PRICE_REQUIRED = "Giá cơ bản không được để trống.";
    public static final String PRICING_POLICY_BASE_PRICE_POSITIVE = "Giá cơ bản phải là số dương.";
    public static final String PRICING_POLICY_EXTRA_FEE_REQUIRED = "Phí phụ thu mỗi giờ không được để trống.";
    public static final String PRICING_POLICY_EXTRA_FEE_POSITIVE = "Phí phụ thu mỗi giờ phải là số dương.";
    public static final String PRICING_POLICY_EFFECTIVE_DATE_REQUIRED = "Ngày áp dụng không được để trống.";

    /**
     * E2 - Trùng lặp chính sách giá
     */
    public static final String PRICING_POLICY_DUPLICATE = "Bảng giá đã tồn tại cho loại xe này vào ngày áp dụng đã chọn.";

    /**
     * E3 - Ràng buộc dữ liệu
     */
    public static final String PRICING_POLICY_IN_USE_DELETE = "Không thể xóa. Bảng giá này đang được tham chiếu tính phí cho các lượt gửi xe.";
    public static final String PRICING_POLICY_IN_USE_UPDATE = "Không thể cập nhật. Bảng giá này đang được tham chiếu tính phí cho các lượt gửi xe.";

    /**
     * E3 - Error code theo API Contract
     */
    public static final String BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION";

    /**
     * Not Found
     */
    public static final String PRICING_POLICY_NOT_FOUND = "Không tìm thấy bảng giá với ID: ";
    public static final String VEHICLE_TYPE_NOT_FOUND = "Không tìm thấy loại phương tiện với ID: ";
}
