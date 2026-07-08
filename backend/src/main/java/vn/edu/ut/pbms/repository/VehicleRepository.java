package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.Vehicle;

import java.util.Optional;

/**
 * Repository interface for Vehicle entity.
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /**
     * Find a vehicle by its license plate.
     *
     * @param plate the license plate to search for
     * @return an Optional containing the Vehicle if found, or empty
     */
    Optional<Vehicle> findByPlate(String plate);

    /**
     * Check if a vehicle exists with the given license plate.
     *
     * @param plate the license plate to check
     * @return true if the vehicle exists
     */
    boolean existsByPlate(String plate);
}
