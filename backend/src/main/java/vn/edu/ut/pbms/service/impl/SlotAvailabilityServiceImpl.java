package vn.edu.ut.pbms.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.event.SlotAvailabilityChangedEvent;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.service.SlotAvailabilityService;

@Service
@RequiredArgsConstructor
public class SlotAvailabilityServiceImpl implements SlotAvailabilityService {

    private final EntityManager entityManager;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public void updateSlotStatus(Long slotId, ParkingSlotStatus newStatus) {
        // Use PESSIMISTIC_WRITE lock to prevent concurrent modifications
        ParkingSlot slot = entityManager.find(ParkingSlot.class, slotId, LockModeType.PESSIMISTIC_WRITE);
        
        if (slot == null) {
            throw new BusinessRuleViolationException("Parking slot not found with id: " + slotId);
        }

        // Only update if status is actually changing
        if (slot.getStatus() != newStatus) {
            slot.setStatus(newStatus);
            
            // Force flush so that listeners see the updated state if they run in a new transaction
            entityManager.flush();
            
            // Publish event. Listener will handle the actual broadcast after commit.
            eventPublisher.publishEvent(new SlotAvailabilityChangedEvent(
                    this, 
                    slot.getFloor().getBuilding().getId(), 
                    slot.getFloor().getId()
            ));
        }
    }
}
