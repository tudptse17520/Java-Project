package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating system configurations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigRequest {

    @NotBlank(message = "Config value cannot be blank")
    @Size(max = 255, message = "Max length is 255 characters")
    private String configValue;

    @NotBlank(message = "Description cannot be blank")
    private String description;
}
