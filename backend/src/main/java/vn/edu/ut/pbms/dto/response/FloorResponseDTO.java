package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.FloorStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FloorResponseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("floor_name")
    private String floorName;

    @JsonProperty("floor_level")
    private Integer floorLevel;

    @JsonProperty("capacity")
    private Integer capacity;

    @JsonProperty("status")
    private FloorStatus status;

    @JsonProperty("available_slots")
    private Long availableSlots;

    @JsonProperty("building_id")
    private Long buildingId;

    @JsonProperty("building_name")
    private String buildingName;

    @JsonProperty("vehicle_type_id")
    private Long vehicleTypeId;

    @JsonProperty("vehicle_type_name")
    private String vehicleTypeName;
}