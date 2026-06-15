package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.constant.PricingPolicyStatus;
import vn.edu.ut.pbms.entity.PricingPolicy;

/**
 * Repository for PricingPolicy entity.
 * Provides query method for VehicleType deactivation check (E3).
 */
@Repository
public interface PricingPolicyRepository extends JpaRepository<PricingPolicy, Long> {

    /**
     * Check if any active pricing policy references the given vehicle type.
     *
     * @param vehicleTypeId the vehicle type ID to check
     * @param status        the pricing policy status to match (ACTIVE)
     * @return true if at least one active pricing policy exists for this vehicle type
     */
    boolean existsByVehicleType_IdAndStatus(Long vehicleTypeId, PricingPolicyStatus status);
}
