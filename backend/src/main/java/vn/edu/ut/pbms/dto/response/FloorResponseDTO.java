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

    private Long id;

    @JsonProperty("floor_name")
    private String floorName;

    @JsonProperty("floor_level")
    private Integer floorLevel;

    private Integer capacity;

    private FloorStatus status;
}
