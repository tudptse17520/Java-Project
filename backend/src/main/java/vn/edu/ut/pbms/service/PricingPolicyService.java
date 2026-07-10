package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.PricingPolicyRequestDTO;

import java.util.Map;

/**
 * Service interface cho nghiệp vụ Quản lý bảng giá (PricingPolicy).
 * Định nghĩa các thao tác: Xem danh sách, Tìm kiếm, Thêm mới, Cập nhật, Xóa.
 */
public interface PricingPolicyService {

    /**
     * Lấy danh sách tất cả bảng giá của toàn bộ hệ thống.
     *
     * @return Map chứa "message" và "data" (danh sách PricingPolicyResponseDTO)
     */
    Map<String, Object> getAllPricingPolicies();

    /**
     * Lấy danh sách bảng giá cụ thể theo loại xe.
     *
     * @param vehicleTypeId mã loại xe cần lọc
     * @return Map chứa "message" và "data"
     */
    Map<String, Object> getPricingPoliciesByVehicleTypeId(Long vehicleTypeId);

    /**
     * Thêm mới một bảng giá.
     * Xử lý: E1 (validation ở Controller), E2 (trùng lặp ngày áp dụng của cùng loại xe).
     *
     * @param requestDTO dữ liệu bảng giá từ client
     * @return Map chứa "id" và "message" thành công
     */
    Map<String, Object> createPricingPolicy(PricingPolicyRequestDTO requestDTO);

    /**
     * Cập nhật một bảng giá hiện có.
     * Xử lý: E2 (trùng lặp), E3 (ràng buộc dữ liệu).
     *
     * @param id         ID của bảng giá cần cập nhật
     * @param requestDTO dữ liệu cập nhật từ client
     * @return Map chứa "id" và "message" thành công
     */
    Map<String, Object> updatePricingPolicy(Long id, PricingPolicyRequestDTO requestDTO);

    /**
     * Xóa một bảng giá khỏi hệ thống.
     * Xử lý: E3 (ràng buộc dữ liệu – không xóa được nếu đang có ParkingSession tham chiếu).
     *
     * @param id ID của bảng giá cần xóa
     * @return Map chứa "message" thành công
     */
    Map<String, Object> deletePricingPolicy(Long id);
}
