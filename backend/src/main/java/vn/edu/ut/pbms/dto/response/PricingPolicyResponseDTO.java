package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

import vn.edu.ut.pbms.constant.PricingPolicyStatus;

/**
 * DTO trả về thông tin bảng giá cho client trong API responses.
 * Cấu trúc khớp với API Contract Phase 1 – Section 4.1.B.
 * effective_date trả về dạng DD-MM-YYYY đúng spec.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingPolicyResponseDTO {

    private Long id;

    @JsonProperty("vehicle_type_id")
    private Long vehicleTypeId;

    @JsonProperty("base_price")
    private BigDecimal basePrice;

    @JsonProperty("extra_fee_per_hour")
    private BigDecimal extraFeePerHour;

    @JsonProperty("effective_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate effectiveDate;

    @JsonProperty("status")
    private PricingPolicyStatus status;
}
