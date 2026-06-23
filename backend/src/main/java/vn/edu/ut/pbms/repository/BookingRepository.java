package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.Booking;

/**
 * Repository interface for Booking entity.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
}
