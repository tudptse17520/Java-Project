package vn.edu.ut.pbms.dto.response;

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
    private LocalDateTime timeIn;
    private LocalDateTime timeOut;
    private BigDecimal totalFee;
}
