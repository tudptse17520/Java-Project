package vn.edu.ut.pbms.exception;

/**
 * Exception được ném ra khi xác thực người dùng thất bại.
 * Maps to HTTP 401 Unauthorized.
 */
public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message);
    }
}
