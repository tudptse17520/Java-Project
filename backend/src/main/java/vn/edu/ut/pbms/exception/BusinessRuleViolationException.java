package vn.edu.ut.pbms.exception;

/**
 * Exception thrown when a business rule is violated (e.g., cannot deactivate a vehicle type
 * that has active pricing policies or vehicles currently parked).
 * Maps to HTTP 400 Bad Request.
 */
public class BusinessRuleViolationException extends RuntimeException {

    public BusinessRuleViolationException(String message) {
        super(message);
    }
}
