package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO yêu cầu bỏ qua lỗi sai biển số của nhân viên bãi xe.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverrideCheckoutRequest {

    @NotNull(message = "Mã nhân viên không được để trống.")
    @JsonProperty("staff_id")
    private Long staffId;

    @NotBlank(message = "Lý do ghi đè/bỏ qua không được để trống.")
    @JsonProperty("override_reason")
    private String overrideReason;
}
