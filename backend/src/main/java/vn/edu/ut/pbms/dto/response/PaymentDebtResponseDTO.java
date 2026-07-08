package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDebtResponseDTO {
    
    @JsonProperty("session_id")
    private Long sessionId;

    @JsonProperty("total_fee")
    private BigDecimal totalFee;

    @JsonProperty("paid_fee")
    private BigDecimal paidFee;

    @JsonProperty("remaining_fee")
    private BigDecimal remainingFee;
}
