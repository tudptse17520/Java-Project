package vn.edu.ut.pbms.dto.response;

import vn.edu.ut.pbms.constant.Role;
import vn.edu.ut.pbms.constant.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for user data.
 * Never exposes the password field.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private UserStatus status;
}
