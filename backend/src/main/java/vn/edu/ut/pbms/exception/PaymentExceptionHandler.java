package vn.edu.ut.pbms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Exception handler specifically for Payment module exceptions.
 * Handles InvalidStateTransitionException which is not covered by the global handler.
 * This is a separate @RestControllerAdvice to avoid modifying existing GlobalExceptionHandler.
 */
@RestControllerAdvice
public class PaymentExceptionHandler {

    /**
     * Handle invalid state transition errors (e.g., updating a non-PENDING payment).
     * Returns HTTP 400 Bad Request with the appropriate error code.
     */
    @ExceptionHandler(InvalidStateTransitionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidStateTransitionException(
            InvalidStateTransitionException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error(ex.getErrorCode())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
