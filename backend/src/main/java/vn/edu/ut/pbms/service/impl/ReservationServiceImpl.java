package vn.edu.ut.pbms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.pbms.entity.Reservation;
import vn.edu.ut.pbms.repository.ReservationRepository;
import vn.edu.ut.pbms.service.ReservationService;

@Service
public class ReservationServiceImpl implements ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }
}