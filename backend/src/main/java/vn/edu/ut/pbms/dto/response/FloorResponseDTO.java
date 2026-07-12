package vn.edu.ut.pbms.dto.response;

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
    private String floorName;
    private Integer floorLevel;
    private Integer capacity;
    private FloorStatus status;
    private Long availableSlots;
    private Long buildingId;
    private String buildingName;
    private Long vehicleTypeId;
    private String vehicleTypeName;
}