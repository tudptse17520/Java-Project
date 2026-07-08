package vn.edu.ut.pbms.event;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import vn.edu.ut.pbms.dto.response.SlotAvailabilityEventDTO;
import vn.edu.ut.pbms.service.SseEmitterManager;

@Component
@RequiredArgsConstructor
public class SlotAvailabilityEventListener {

    private final EntityManager entityManager;
    private final SseEmitterManager sseEmitterManager;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(readOnly = true)
    public void handleSlotAvailabilityChanged(SlotAvailabilityChangedEvent event) {
        Long buildingId = event.getBuildingId();
        Long floorId = event.getFloorId();

        // Query the new available count for this floor
        String countHql = "SELECT COUNT(p) FROM ParkingSlot p WHERE p.floor.id = :floorId AND p.status = 'AVAILABLE'";
        Long availableSlots = entityManager.createQuery(countHql, Long.class)
                .setParameter("floorId", floorId)
                .getSingleResult();

        // Query the new available count for the entire building
        String buildingCountHql = "SELECT COUNT(p) FROM ParkingSlot p WHERE p.floor.building.id = :buildingId AND p.status = 'AVAILABLE'";
        Long buildingAvailableSlots = entityManager.createQuery(buildingCountHql, Long.class)
                .setParameter("buildingId", buildingId)
                .getSingleResult();

        // Create payload
        SlotAvailabilityEventDTO payload = SlotAvailabilityEventDTO.builder()
                .buildingId(buildingId)
                .floorId(floorId)
                .availableSlots(availableSlots)
                .buildingAvailableSlots(buildingAvailableSlots)
                .build();

        // Broadcast to clients subscribed to this building
        sseEmitterManager.broadcastToBuilding(buildingId, payload);
    }
}
