package vn.edu.ut.pbms.exception;

public class PaymentRequiredException extends RuntimeException {
    public PaymentRequiredException(String message) {
        super(message);
    }
}