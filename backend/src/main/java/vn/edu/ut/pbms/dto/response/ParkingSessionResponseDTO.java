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
    private String ticketCode;
    private String status;
    private LocalDateTime timeIn;
    private LocalDateTime timeOut;
    private BigDecimal totalFee;
    private Long vehicleId;
    private Long parkingSlotId;
}
