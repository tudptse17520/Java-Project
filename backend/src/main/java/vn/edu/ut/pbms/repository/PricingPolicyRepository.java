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
}
