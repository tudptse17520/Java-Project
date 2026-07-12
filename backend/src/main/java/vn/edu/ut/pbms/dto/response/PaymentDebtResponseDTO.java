package vn.edu.ut.pbms.dto.response;

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
    private Long sessionId;
    private BigDecimal totalFee;
    private BigDecimal paidFee;
    private BigDecimal remainingFee;
}
