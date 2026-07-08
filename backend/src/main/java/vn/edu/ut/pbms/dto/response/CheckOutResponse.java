package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO trả về kết quả đóng phiên xe ra bãi (Check-out) hoặc ghi đè (Override).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CheckOutResponse {

    @JsonProperty("session_id")
    private Long sessionId;

    @JsonProperty("time_in")
    private LocalDateTime timeIn;

    @JsonProperty("time_out")
    private LocalDateTime timeOut;

    @JsonProperty("total_fee")
    private BigDecimal totalFee;

    private ParkingSessionStatus status;

    private String message;
}
