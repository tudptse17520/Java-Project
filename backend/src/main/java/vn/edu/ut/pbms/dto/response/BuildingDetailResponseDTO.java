package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.BuildingStatus;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingDetailResponseDTO {

    private Long id;

    @JsonProperty("building_name")
    private String buildingName;

    private String address;

    @JsonProperty("number_of_floors")
    private Integer numberOfFloors;

    private BuildingStatus status;

    private List<FloorResponseDTO> floors;
}
