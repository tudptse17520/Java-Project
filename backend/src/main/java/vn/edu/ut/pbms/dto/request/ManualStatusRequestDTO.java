package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Parking Staff manual status update on a PENDING payment.
 * Requires status (SUCCESS or FAILED) and a mandatory audit note (minimum 10 characters).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManualStatusRequestDTO {

    @JsonProperty("status")
    @NotBlank(message = "Trạng thái mới không được để trống.")
    private String status;

    @JsonProperty("note")
    @NotBlank(message = "Nhân viên bắt buộc phải nhập lý do chi tiết khi thao tác cập nhật thủ công.")
    private String note;
}
