package vn.edu.ut.pbms.dto.request;

import vn.edu.ut.pbms.constant.PaymentMethod;
import vn.edu.ut.pbms.constant.FeeType;

import jakarta.validation.constraints.DecimalMin;
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
    private Long parkingSessionId;
    private Long bookingId;

    @NotNull(message = "Số tiền thanh toán không được để trống.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền thanh toán phải lớn hơn 0.")
    private BigDecimal amount;

    @NotNull(message = "Phương thức thanh toán không được để trống.")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Loại chi phí không được để trống.")
    private FeeType feeType;
}
