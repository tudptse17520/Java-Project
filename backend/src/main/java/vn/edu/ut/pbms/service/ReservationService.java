package vn.edu.ut.pbms.service;

import java.util.List;

import vn.edu.ut.pbms.entity.Reservation;

public interface ReservationService {
    List<Reservation> getAllReservations();
    Reservation createReservation(Reservation reservation);
}