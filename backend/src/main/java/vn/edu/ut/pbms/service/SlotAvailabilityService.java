package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.constant.ParkingSlotStatus;

public interface SlotAvailabilityService {
    
    /**
     * Updates the status of a parking slot with pessimistic locking to prevent race conditions.
     * Fires an event to update SSE clients after the transaction commits.
     * 
     * @param slotId the ID of the parking slot
     * @param newStatus the new status
     */
    void updateSlotStatus(Long slotId, ParkingSlotStatus newStatus);
}
