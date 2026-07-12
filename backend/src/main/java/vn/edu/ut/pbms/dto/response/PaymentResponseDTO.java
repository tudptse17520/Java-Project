package vn.edu.ut.pbms.dto.response;

import vn.edu.ut.pbms.constant.PaymentStatus;
import vn.edu.ut.pbms.constant.PaymentMethod;
import vn.edu.ut.pbms.constant.FeeType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for sending payment data back to the client in API responses.
 * Used for both single detail and list item responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private Long id;
    private Long parkingSessionId;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private FeeType feeType;
    private String paymentTime;
    private PaymentStatus status;
    private String paymentUrl;
}
