package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.PricingPolicy;

/**
 * Repository for PricingPolicy entity.
 */
@Repository
public interface PricingPolicyRepository extends JpaRepository<PricingPolicy, Long> {

    /**
     * Check if any pricing policy references the given vehicle type.
     *
     * @param vehicleTypeId the vehicle type ID to check
     * @return true if at least one pricing policy exists for this vehicle type
     */
    boolean existsByVehicleType_Id(Long vehicleTypeId);

    /**
     * Tìm chính sách giá có hiệu lực mới nhất của một loại phương tiện tại thời điểm chỉ định.
     *
     * @param vehicleTypeId mã loại phương tiện
     * @param dateTime      thời điểm cần áp dụng chính sách giá (thường là lúc check-in hoặc hiện tại)
     * @return một Optional chứa PricingPolicy nếu tìm thấy
     */
    java.util.Optional<PricingPolicy> findFirstByVehicleType_IdAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(Long vehicleTypeId, java.time.LocalDateTime dateTime);
}
