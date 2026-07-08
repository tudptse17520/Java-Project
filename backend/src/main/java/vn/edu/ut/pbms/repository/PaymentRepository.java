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
}
