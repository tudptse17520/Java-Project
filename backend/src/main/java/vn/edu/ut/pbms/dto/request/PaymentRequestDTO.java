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
 * DTO for receiving payment creation data from client requests.
 * Ràng buộc nghiệp vụ: Bắt buộc phải truyền 1 trong 2 tham số parking_session_id hoặc booking_id.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {

    @JsonProperty("parking_session_id")
    private Long parkingSessionId;

    @JsonProperty("booking_id")
    private Long bookingId;

    @JsonProperty("amount")
    @NotNull(message = "Số tiền thanh toán không được để trống.")
    @DecimalMin(value = "1000", message = "Số tiền thanh toán tối thiểu là 1.000đ.")
    private BigDecimal amount;

    @JsonProperty("payment_method")
    @NotBlank(message = "Phương thức thanh toán không được để trống.")
    private String paymentMethod;

    @JsonProperty("fee_type")
    @NotBlank(message = "Loại phí không được để trống.")
    private String feeType;
}
