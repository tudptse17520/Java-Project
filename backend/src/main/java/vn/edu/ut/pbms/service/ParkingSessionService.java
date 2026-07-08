package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.CheckinRequest;
import vn.edu.ut.pbms.dto.response.CheckinResponse;
import vn.edu.ut.pbms.dto.response.ParkingSessionListResponseDTO;

/**
 * Service interface for Parking Session operations.
 */
public interface ParkingSessionService {

    /**
     * View parking sessions with dynamic filters.
     * Staff dùng để tìm xe lúc ra, Manager dùng để "Theo dõi xe quá giờ".
     *
     * @param plate    the license plate to filter by (optional, exact match)
     * @param status   the status string to filter by (optional, validated against ParkingSessionStatus enum)
     * @param fromDate the minimum time_in as a string, cast to LocalDateTime (optional)
     * @return a response containing total_items and data array
     */
    ParkingSessionListResponseDTO getParkingSessions(String plate, String status, String fromDate);

    /**
     * Process checking in a vehicle.
     *
     * @param request the check-in details
     * @return check-in status and confirmation details
     */
    CheckinResponse checkInVehicle(CheckinRequest request);
}