package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.constant.PaymentStatus;
import vn.edu.ut.pbms.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Custom JPA Repository for Payment entity.
 * Provides custom @Query methods for sum aggregations and dynamic filtering.
 */
@Repository
public interface PaymentCustomRepository extends JpaRepository<Payment, Long> {

    /**
     * Sum all successful payment amounts for a given parking session.
     * Used for E3 (Overpayment Violation) check.
     *
     * @param sessionId the parking session ID
     * @return total amount of successful payments, or BigDecimal.ZERO if none
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p " +
            "WHERE p.parkingSession.id = :sessionId AND p.status = vn.edu.ut.pbms.constant.PaymentStatus.SUCCESS")
    BigDecimal sumSuccessfulAmountBySessionId(@Param("sessionId") Long sessionId);

    /**
     * Sum all successful payment amounts for a given booking.
     * Used for E3 (Overpayment Violation) check on booking deposits.
     *
     * @param bookingId the booking ID
     * @return total amount of successful payments, or BigDecimal.ZERO if none
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p " +
            "WHERE p.booking.id = :bookingId AND p.status = vn.edu.ut.pbms.constant.PaymentStatus.SUCCESS")
    BigDecimal sumSuccessfulAmountByBookingId(@Param("bookingId") Long bookingId);

    /**
     * Find payments by dynamic filters (payment_method, status, from_date).
     * All parameters are optional — null values are ignored in the query.
     *
     * @param paymentMethod filter by payment method (nullable)
     * @param status        filter by payment status enum (nullable)
     * @param fromDateTime  filter payments from this datetime onwards (nullable)
     * @return list of matching Payment entities ordered by payment_time descending
     */
    @Query("SELECT p FROM Payment p WHERE " +
            "(:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:fromDateTime IS NULL OR p.paymentTime >= :fromDateTime) " +
            "ORDER BY p.paymentTime DESC")
    List<Payment> findByFilters(@Param("paymentMethod") String paymentMethod,
                                @Param("status") PaymentStatus status,
                                @Param("fromDateTime") LocalDateTime fromDateTime);
}
