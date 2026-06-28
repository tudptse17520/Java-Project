package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("id")
    private Long id;

    @JsonProperty("parking_session_id")
    private Long parkingSessionId;

    @JsonProperty("booking_id")
    private Long bookingId;

    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("fee_type")
    private String feeType;

    @JsonProperty("payment_time")
    private String paymentTime;

    @JsonProperty("status")
    private String status;
}
