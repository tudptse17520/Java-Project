package vn.edu.ut.pbms.service;

import java.util.List;

import vn.edu.ut.pbms.dto.request.ReservationRequest;
import vn.edu.ut.pbms.dto.response.ReservationResponse;

public interface ReservationService {
    List<ReservationResponse> getAllReservations();
    ReservationResponse createReservation(ReservationRequest request);
}