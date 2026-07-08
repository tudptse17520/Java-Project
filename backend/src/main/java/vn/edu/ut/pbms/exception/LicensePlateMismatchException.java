package vn.edu.ut.pbms.exception;

/**
 * Exception được ném ra khi biển số xe nhận diện ở cổng ra không khớp với biển số xe lúc vào bãi.
 * Maps to HTTP 409 Conflict.
 */
public class LicensePlateMismatchException extends RuntimeException {

    public LicensePlateMismatchException(String message) {
        super(message);
    }
}
