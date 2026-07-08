package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;
import vn.edu.ut.pbms.dto.request.CheckinRequest;
import vn.edu.ut.pbms.dto.response.CheckinResponse;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.entity.Vehicle;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.repository.VehicleRepository;
import vn.edu.ut.pbms.service.ParkingSessionService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Implementation of ParkingSessionService.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ParkingSessionServiceImpl implements ParkingSessionService {

    private final ParkingSessionRepository parkingSessionRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSlotRepository parkingSlotRepository;

    @Override
    public CheckinResponse checkInVehicle(CheckinRequest request) {
        // 1. Fetch relations if IDs are provided
        Vehicle vehicle = null;
        if (request.getVehicleId() != null) {
            vehicle = vehicleRepository.findById((long) request.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy phương tiện với ID: " + request.getVehicleId()));
        }

        ParkingSlot parkingSlot = null;
        if (request.getParkingSlotId() != null) {
            parkingSlot = parkingSlotRepository.findById((long) request.getParkingSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy vị trí đỗ với ID: " + request.getParkingSlotId()));
        }

        // 2. Generate unique ticket code
        String ticketCode = "TK-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();

        // 3. Set default timeIn and status
        LocalDateTime timeIn = LocalDateTime.now();
        ParkingSessionStatus status = ParkingSessionStatus.IN_PROGRESS;

        // 4. Build and save the entity
        ParkingSession session = ParkingSession.builder()
                .plate(request.getPlate())
                .ticketCode(ticketCode)
                .timeIn(timeIn)
                .status(status)
                .vehicle(vehicle)
                .parkingSlot(parkingSlot)
                .build();

        ParkingSession savedSession = parkingSessionRepository.save(session);

        // 5. Construct and return response DTO
        return CheckinResponse.builder()
                .id(savedSession.getId().intValue())
                .ticketCode(savedSession.getTicketCode())
                .timeIn(savedSession.getTimeIn().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .status(savedSession.getStatus().name())
                .message("Xe check-in thành công.")
                .build();
    }
}
