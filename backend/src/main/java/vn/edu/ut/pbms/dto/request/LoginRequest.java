package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO nhận dữ liệu đăng nhập từ client.
 * Yêu cầu bắt buộc phải có username và password.
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Tên tài khoản không được để trống.")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống.")
    private String password;
}
