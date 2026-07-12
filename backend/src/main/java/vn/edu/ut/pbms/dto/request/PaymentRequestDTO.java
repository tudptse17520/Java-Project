package vn.edu.ut.pbms.dto.request;

import vn.edu.ut.pbms.constant.PaymentMethod;
import vn.edu.ut.pbms.constant.FeeType;

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
    private Long parkingSessionId;
    private Long bookingId;
    @NotNull(message = "Số tiền thanh toán không được để trống.")
    @DecimalMin(value = "1000", message = "Số tiền thanh toán tối thiểu là 1.000đ.")
    private BigDecimal amount;
    @NotNull(message = "Phương thức thanh toán không được để trống.")
    private PaymentMethod paymentMethod;
    @NotNull(message = "Loại phí không được để trống.")
    private FeeType feeType;
}
