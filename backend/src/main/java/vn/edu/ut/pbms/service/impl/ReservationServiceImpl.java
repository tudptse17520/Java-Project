package vn.edu.ut.pbms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.pbms.dto.request.ReservationRequest;
import vn.edu.ut.pbms.dto.response.ReservationResponse;
import vn.edu.ut.pbms.entity.Reservation;
import vn.edu.ut.pbms.repository.ReservationRepository;
import vn.edu.ut.pbms.service.ReservationService;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream().map(r -> ReservationResponse.builder()
                .id(r.getId())
                .status(r.getStatus())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                // Kiểm tra null để tránh lỗi 
                .userName(r.getDriver() != null ? r.getDriver().getFullName() : null) 
                .slotName(r.getParkingSlot() != null ? r.getParkingSlot().getSlotName() : null)
                .build()).collect(Collectors.toList());
    }

    @Override
    public ReservationResponse createReservation(ReservationRequest request) {
        Reservation reservation = Reservation.builder()
                .status(request.getStatus())
                .build();
        
        Reservation saved = reservationRepository.save(reservation);

        return ReservationResponse.builder()
                .id(saved.getId())
                .status(saved.getStatus())
                .startTime(saved.getStartTime())
                .endTime(saved.getEndTime())
                .userName(saved.getDriver() != null ? saved.getDriver().getFullName() : null)
                .slotName(saved.getParkingSlot() != null ? saved.getParkingSlot().getSlotName() : null)
                .build();
    }
}