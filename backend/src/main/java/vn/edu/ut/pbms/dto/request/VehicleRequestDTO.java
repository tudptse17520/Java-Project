package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequestDTO {


    @NotNull(message = "Mã loại xe không được để trống")
    private Long vehicleTypeId;

    @NotBlank(message = "Biển số xe không được để trống")
    private String plate;

    private String brand;

    private String color;
}
