package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("base_fee")
    private BigDecimal baseFee;

    @JsonProperty("overtime_fee")
    private BigDecimal overtimeFee;

    @JsonProperty("penalty_fee")
    private BigDecimal penaltyFee;

    @JsonProperty("total_fee")
    private BigDecimal totalFee;

    @JsonProperty("message")
    private String message;
}
