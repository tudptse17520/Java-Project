package vn.edu.ut.pbms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingSlotResponse {
    private Long id;
    private Long floorId;
    private String slotName;
    private String status;
}