package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.LoginRequest;
import vn.edu.ut.pbms.dto.response.LoginResponse;

/**
 * Interface định nghĩa nghiệp vụ xác thực người dùng.
 */
public interface AuthService {

    /**
     * Xác thực tài khoản và cấp JWT token.
     *
     * @param request chứa username và password
     * @return LoginResponse chứa token, message, và role
     */
    LoginResponse login(LoginRequest request);
}
