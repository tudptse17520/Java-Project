package vn.edu.ut.pbms.exception;

/**
 * Exception được ném ra khi xe ra bãi chưa thanh toán đầy đủ phí đỗ xe.
 * Maps to HTTP 402 Payment Required.
 */
public class UnpaidExitException extends RuntimeException {

    public UnpaidExitException(String message) {
        super(message);
    }
}
