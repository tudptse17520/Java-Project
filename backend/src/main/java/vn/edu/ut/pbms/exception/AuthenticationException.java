package vn.edu.ut.pbms.exception;

/**
 * Exception được ném ra khi xác thực người dùng thất bại.
 * Các trường hợp: sai mật khẩu, tài khoản bị vô hiệu hóa.
 * Maps to HTTP 401 Unauthorized.
 */
public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message);
    }
}
