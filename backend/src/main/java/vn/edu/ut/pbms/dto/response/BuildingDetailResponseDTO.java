package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class BuildingDetailResponseDTO {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("building_name")
    private String buildingName;

    @JsonProperty("address")
    private String address;

    @JsonProperty("number_of_floors")
    private Integer numberOfFloors;

    @JsonProperty("status")
    private String status;

    @JsonProperty("total_available_slots")
    private Long totalAvailableSlots;

    @JsonProperty("floors")
    private List<FloorResponseDTO> floors;
}
