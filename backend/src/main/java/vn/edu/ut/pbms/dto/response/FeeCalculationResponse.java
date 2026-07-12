package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO trả về kết quả tính cước phí gửi xe (bao gồm cả trường hợp mất vé).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FeeCalculationResponse {
    private BigDecimal baseFee;
    private BigDecimal overtimeFee;
    private BigDecimal penaltyFee;
    private BigDecimal totalFee;
    private String message;
}
