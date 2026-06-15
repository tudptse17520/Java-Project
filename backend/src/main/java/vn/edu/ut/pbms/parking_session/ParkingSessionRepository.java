package vn.edu.ut.pbms.parking_session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for ParkingSession entity.
 * Provides query method for VehicleType deactivation check (E3).
 */
@Repository
public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {

    /**
     * Check if any parking session with the given status exists for vehicles of a specific vehicle type.
     * Uses Spring Data JPA derived query through nested property: vehicle -> vehicleType -> id.
     *
     * @param vehicleTypeId the vehicle type ID to check
     * @param status        the parking session status to match (IN)
     * @return true if at least one active parking session exists for vehicles of this type
     */
    boolean existsByVehicleVehicleTypeIdAndStatus(Long vehicleTypeId, ParkingSessionStatus status);
}
