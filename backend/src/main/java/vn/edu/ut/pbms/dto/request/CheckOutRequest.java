package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO yêu cầu hoàn tất quá trình xe ra bãi (Check-out).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckOutRequest {

    @NotNull(message = "Thời gian xe ra bãi không được để trống.")
    @JsonProperty("time_out")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timeOut;
}
