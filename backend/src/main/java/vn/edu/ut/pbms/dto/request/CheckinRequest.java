package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for vehicle check-in.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckinRequest {

    @NotBlank(message = "Plate number cannot be blank")
    private String plate;

    private Integer vehicleId;

    private Integer parkingSlotId;
}
