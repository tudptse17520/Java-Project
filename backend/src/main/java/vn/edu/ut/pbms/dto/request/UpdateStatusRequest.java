package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotNull;
import vn.edu.ut.pbms.constant.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating user status.
 * Accepts a String value that maps to the UserStatus enum.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {

    @NotNull(message = "Trạng thái không được để trống.")
    private UserStatus status;
}
