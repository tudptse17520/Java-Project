package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponseDTO {
    private Long id;
    private Long userId;
    private Long vehicleTypeId;
    private String vehicleTypeName;
    private String plate;
    private String brand;
    private String color;
}
