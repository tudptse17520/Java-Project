package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.CheckinRequest;
import vn.edu.ut.pbms.dto.response.CheckinResponse;

/**
 * Service interface for Parking Session operations.
 */
public interface ParkingSessionService {

    /**
     * Process checking in a vehicle.
     *
     * @param request the check-in details
     * @return check-in status and confirmation details
     */
    CheckinResponse checkInVehicle(CheckinRequest request);
}
