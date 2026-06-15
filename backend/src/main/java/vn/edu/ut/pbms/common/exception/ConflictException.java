package vn.edu.ut.pbms.common.exception;

/**
 * Exception thrown when a resource conflict occurs (e.g., duplicate name).
 * Maps to HTTP 409 Conflict.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
