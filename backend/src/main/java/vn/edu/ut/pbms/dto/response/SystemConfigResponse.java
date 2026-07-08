package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO representing detailed system configuration parameter.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigResponse {

    private int id;
    private String configKey;
    private String configValue;
    private String description;
}
