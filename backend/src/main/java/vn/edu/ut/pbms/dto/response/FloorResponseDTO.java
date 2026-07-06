package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
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
    private String status;

    @JsonProperty("available_slots")
    private Long availableSlots;

    @JsonProperty("vehicle_type_name")
    private String vehicleTypeName;
}
