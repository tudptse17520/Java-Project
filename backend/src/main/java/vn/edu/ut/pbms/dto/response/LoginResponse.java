package vn.edu.ut.pbms.dto.response;

import vn.edu.ut.pbms.constant.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về kết quả đăng nhập cho client.
 * Bao gồm JWT token, thông báo trạng thái, và vai trò người dùng.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private String message;

    private Role role;
}
