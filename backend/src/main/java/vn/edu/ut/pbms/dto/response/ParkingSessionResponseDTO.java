package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSessionResponseDTO {
    
    private Long id;
    
    private String plate;
    
    @JsonProperty("time_in")
    private LocalDateTime timeIn;
    
    @JsonProperty("time_out")
    private LocalDateTime timeOut;
    
    @JsonProperty("total_fee")
    private BigDecimal totalFee;
}
