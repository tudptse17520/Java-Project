package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.PaymentStatus;

import java.time.LocalDateTime;

/**
 * DTO trả về thông tin kết quả giao dịch thanh toán.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;

    @JsonProperty("payment_time")
    private LocalDateTime paymentTime;

    private PaymentStatus status;
}
