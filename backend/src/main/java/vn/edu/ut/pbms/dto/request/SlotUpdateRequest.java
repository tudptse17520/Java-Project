package vn.edu.ut.pbms.dto.request;

import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SlotUpdateRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private ParkingSlotStatus status; 
}