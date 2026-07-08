package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO yêu cầu báo mất vé/thẻ xe.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LostTicketRequest {

    @NotNull(message = "Mã nhân viên xác nhận không được để trống.")
    @JsonProperty("staff_id")
    private Long staffId;

    private String note;
}
