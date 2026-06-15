package vn.edu.ut.pbms.pricing_policy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
    boolean existsByVehicleTypeIdAndStatus(Long vehicleTypeId, PricingPolicyStatus status);
}
