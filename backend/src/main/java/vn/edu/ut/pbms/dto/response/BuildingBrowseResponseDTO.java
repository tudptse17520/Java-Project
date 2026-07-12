package vn.edu.ut.pbms.dto.response;

import vn.edu.ut.pbms.constant.BuildingStatus;

import lombok.Data;

@Data
public class BuildingBrowseResponseDTO {
    private Long id;
    private String buildingName;
    private String address;
    private Integer numberOfFloors;
    private BuildingStatus status;
    private Long availableSlots;
}
