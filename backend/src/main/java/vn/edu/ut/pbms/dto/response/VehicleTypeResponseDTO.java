package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.VehicleTypeStatus;

/**
 * DTO for sending vehicle type data back to the client in API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleTypeResponseDTO {

    private Long id;

    @JsonProperty("type_name")
    private String typeName;

    @JsonProperty("description")
    private String description;

    @JsonProperty("status")
    private VehicleTypeStatus status;
}
