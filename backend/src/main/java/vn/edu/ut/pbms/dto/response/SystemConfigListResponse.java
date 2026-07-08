package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO representing paginated/filtered list of system configurations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigListResponse {

    private long totalItems;
    private List<SystemConfigResponse> data;
    private String message;
}
