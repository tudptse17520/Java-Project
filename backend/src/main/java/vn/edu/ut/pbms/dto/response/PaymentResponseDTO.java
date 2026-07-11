package vn.edu.ut.pbms.dto.response;

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
    private String paymentMethod;
    private String feeType;
    private String paymentTime;
    private String status;
    private String paymentUrl;
}
