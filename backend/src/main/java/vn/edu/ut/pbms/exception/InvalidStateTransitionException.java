package vn.edu.ut.pbms.exception;

/**
 * Exception thrown when attempting an invalid state transition on a payment.
 * For example, trying to manually update a payment that is already SUCCESS or FAILED.
 * Maps to HTTP 400 Bad Request with error code INVALID_STATE_TRANSITION.
 */
public class InvalidStateTransitionException extends RuntimeException {

    private final String errorCode;

    public InvalidStateTransitionException(String message) {
        super(message);
        this.errorCode = "INVALID_STATE_TRANSITION";
    }

    public InvalidStateTransitionException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
