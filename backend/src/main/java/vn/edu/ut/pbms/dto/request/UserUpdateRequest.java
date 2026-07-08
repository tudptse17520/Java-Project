package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing user.
 * Username and password are not modifiable through this endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @NotBlank(message = "Họ tên không được để trống.")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống.")
    private String phoneNumber;

    @NotBlank(message = "Vai trò không được để trống.")
    private String role;
}
