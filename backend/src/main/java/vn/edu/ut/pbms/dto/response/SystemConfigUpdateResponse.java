package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO returning updated configuration record identification.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigUpdateResponse {

    private int id;
    private String message;
}
