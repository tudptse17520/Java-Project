package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotAvailabilityEventDTO {
    @JsonProperty("building_id")
    private Long buildingId;

    @JsonProperty("floor_id")
    private Long floorId;

    @JsonProperty("available_slots")
    private Long availableSlots;
    
    @JsonProperty("building_available_slots")
    private Long buildingAvailableSlots;
}
