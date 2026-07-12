package vn.edu.ut.pbms.dto.response;

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
    private String buildingName;
    private String address;
    private Integer numberOfFloors;
    private BuildingStatus status;
    private Long totalAvailableSlots;
    private List<FloorResponseDTO> floors;
}