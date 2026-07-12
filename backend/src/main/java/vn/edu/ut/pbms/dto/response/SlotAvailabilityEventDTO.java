package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotAvailabilityEventDTO {
    private Long buildingId;
    private Long floorId;
    private Long availableSlots;
    private Long buildingAvailableSlots;
}
