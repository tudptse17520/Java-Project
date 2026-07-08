package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingListResponseDTO {

    @JsonProperty("booking_id")
    private Long bookingId;

    @JsonProperty("parking_slot_id")
    private Long parkingSlotId;

    @JsonProperty("expected_time_in")
    private String expectedTimeIn;

    private String status;
}
