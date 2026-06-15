package vn.edu.ut.pbms.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for Vehicle entity.
 * TODO: Add custom query methods when implementing Vehicle feature.
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
