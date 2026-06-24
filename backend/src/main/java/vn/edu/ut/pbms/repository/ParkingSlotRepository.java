package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.ParkingSlot;

/**
 * Repository interface for ParkingSlot entity.
 */
@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
}
