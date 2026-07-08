package vn.edu.ut.pbms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class InvoiceDTO {
    private BigDecimal baseFee;
    private BigDecimal overtimeFee;
    private BigDecimal penaltyFee;
    private BigDecimal totalFee;
    private String message;
}