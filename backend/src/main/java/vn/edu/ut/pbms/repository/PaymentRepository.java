package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.constant.PaymentStatus;
import vn.edu.ut.pbms.entity.Payment;

import java.util.List;

/**
 * Repository interface for Payment entity.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Payment p LEFT JOIN p.parkingSession s LEFT JOIN p.booking b WHERE s.user.id = :userId OR b.user.id = :userId")
    List<Payment> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
