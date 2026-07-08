package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO nhận dữ liệu xác thực biển số xe ở cổng ra.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlateValidationRequest {

    @NotBlank(message = "Biển số xe ra không được để trống.")
    @JsonProperty("plate_out")
    private String plateOut;

    @NotBlank(message = "Ảnh chụp biển số xe ra không được để trống.")
    @JsonProperty("plate_out_image")
    private String plateOutImage;
}
