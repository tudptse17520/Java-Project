package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BuildingBrowseResponseDTO {
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

    @JsonProperty("available_slots")
    private Long availableSlots;
}
