package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.edu.ut.pbms.entity.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}