package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

import vn.edu.ut.pbms.constant.PricingPolicyStatus;

/**
 * DTO nhận dữ liệu bảng giá từ client (Create / Update).
 * Validation annotations xử lý E1 (bỏ trống thông tin bắt buộc).
 * effective_date dùng LocalDate với format DD-MM-YYYY đúng API Contract.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricingPolicyRequestDTO {

    @JsonProperty("vehicle_type_id")
    @NotNull(message = "Danh mục loại xe không được để trống.")
    private Long vehicleTypeId;

    @JsonProperty("base_price")
    @NotNull(message = "Giá cơ bản không được để trống.")
    @Positive(message = "Giá cơ bản phải là số dương.")
    private BigDecimal basePrice;

    @JsonProperty("extra_fee_per_hour")
    @NotNull(message = "Phí phụ thu mỗi giờ không được để trống.")
    @Positive(message = "Phí phụ thu mỗi giờ phải là số dương.")
    private BigDecimal extraFeePerHour;

    @JsonProperty("effective_date")
    @NotNull(message = "Ngày áp dụng không được để trống.")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate effectiveDate;

    @JsonProperty("status")
    private PricingPolicyStatus status;
}
