package vn.edu.ut.pbms.dto.response;

import lombok.Data;

@Data
public class BuildingBrowseResponseDTO {
    private Long id;
    private String buildingName;
    private String address;
    private Integer numberOfFloors;
    private String status;
    private Long availableSlots;
}
