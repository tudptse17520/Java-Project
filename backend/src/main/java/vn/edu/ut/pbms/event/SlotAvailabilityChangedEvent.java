package vn.edu.ut.pbms.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class SlotAvailabilityChangedEvent extends ApplicationEvent {
    private final Long buildingId;
    private final Long floorId;

    public SlotAvailabilityChangedEvent(Object source, Long buildingId, Long floorId) {
        super(source);
        this.buildingId = buildingId;
        this.floorId = floorId;
    }
}
