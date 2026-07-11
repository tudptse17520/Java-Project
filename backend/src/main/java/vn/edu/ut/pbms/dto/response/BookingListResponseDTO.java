package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingListResponseDTO {
    private Long bookingId;
    private Long parkingSlotId;
    private String expectedTimeIn;

    private String status;
}
