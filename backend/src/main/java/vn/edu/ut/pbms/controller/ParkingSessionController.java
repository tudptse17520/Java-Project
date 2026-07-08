package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.dto.request.CheckinRequest;
import vn.edu.ut.pbms.dto.response.CheckinResponse;
import vn.edu.ut.pbms.service.ParkingSessionService;

/**
 * Controller for Parking Session management.
 */
@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@CrossOrigin
public class ParkingSessionController {

    private final ParkingSessionService parkingSessionService;

    /**
     * Endpoint to check in a vehicle.
     *
     * @param request the check-in details
     * @return response with created status and details
     */
    @PostMapping("/check-in")
    public ResponseEntity<CheckinResponse> checkInVehicle(@Valid @RequestBody CheckinRequest request) {
        CheckinResponse response = parkingSessionService.checkInVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
