package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.Booking;

/**
 * Repository interface for Booking entity.
 */
import java.util.List;
import vn.edu.ut.pbms.constant.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByVehicleIdAndStatus(Long vehicleId, BookingStatus status);

    List<Booking> findByUserId(Long userId);
}
