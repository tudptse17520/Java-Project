package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.PricingPolicy;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository mở rộng cho nghiệp vụ Quản lý bảng giá (PricingPolicy).
 * Chứa các custom query riêng cho module PricingPolicy CRUD.
 * File mới, không đụng vào PricingPolicyRepository gốc.
 */
@Repository
public interface PricingPolicyCrudRepository extends JpaRepository<PricingPolicy, Long> {

    /**
     * Tìm danh sách bảng giá theo vehicle_type_id (dùng cho API tìm kiếm / lọc).
     *
     * @param vehicleTypeId mã loại xe cần lọc
     * @return danh sách PricingPolicy của loại xe đó
     */
    List<PricingPolicy> findByVehicleType_Id(Long vehicleTypeId);

    /**
     * Kiểm tra trùng lặp chính sách giá: cùng loại xe + cùng ngày áp dụng (Xử lý E2).
     * Dùng LocalDateTime vì Entity PricingPolicy.effectiveDate là LocalDateTime.
     *
     * @param vehicleTypeId mã loại xe
     * @param effectiveDate ngày áp dụng (convert từ LocalDate sang LocalDateTime.atStartOfDay)
     * @return true nếu đã tồn tại bảng giá trùng
     */
    boolean existsByVehicleType_IdAndEffectiveDate(Long vehicleTypeId, LocalDateTime effectiveDate);

    /**
     * Kiểm tra trùng lặp khi cập nhật: cùng loại xe + cùng ngày, nhưng loại trừ bản ghi hiện tại (Xử lý E2 cho PUT).
     *
     * @param vehicleTypeId mã loại xe
     * @param effectiveDate ngày áp dụng
     * @param id            ID của bản ghi hiện tại (loại trừ)
     * @return true nếu có bản ghi khác bị trùng
     */
    boolean existsByVehicleType_IdAndEffectiveDateAndIdNot(Long vehicleTypeId, LocalDateTime effectiveDate, Long id);
}
