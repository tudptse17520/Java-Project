package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for vehicle check-in.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckinResponse {

    private int id;
    private String ticketCode;
    private String timeIn;
    private String status;
    private String message;
}
