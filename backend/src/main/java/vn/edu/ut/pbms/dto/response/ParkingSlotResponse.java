package vn.edu.ut.pbms.dto.response;

import vn.edu.ut.pbms.constant.ParkingSlotStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingSlotResponse {
    private Long id;
    private Long floorId;
    private String slotName;
    private ParkingSlotStatus status;
}