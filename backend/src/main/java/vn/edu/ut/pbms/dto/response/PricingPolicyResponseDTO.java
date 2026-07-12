package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    private Long vehicleTypeId;
    private BigDecimal basePrice;
    private BigDecimal extraFeePerHour;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate effectiveDate;
    private PricingPolicyStatus status;
}
