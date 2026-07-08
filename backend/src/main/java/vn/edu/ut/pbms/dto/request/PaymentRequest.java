package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO yêu cầu tạo giao dịch thanh toán.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "Mã phiên gửi xe không được để trống.")
    @JsonProperty("parking_session_id")
    private Long parkingSessionId;

    @JsonProperty("booking_id")
    private Long bookingId;

    @NotNull(message = "Số tiền thanh toán không được để trống.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền thanh toán phải lớn hơn 0.")
    private BigDecimal amount;

    @NotBlank(message = "Phương thức thanh toán không được để trống.")
    @JsonProperty("payment_method")
    private String paymentMethod;

    @NotBlank(message = "Loại chi phí không được để trống.")
    @JsonProperty("fee_type")
    private String feeType;
}
