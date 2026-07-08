package vn.edu.ut.pbms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ParkingSlotListResponse {
    private long totalAvailable;
    private List<ParkingSlotResponse> data;
}
