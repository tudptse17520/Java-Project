package vn.edu.ut.pbms.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleEntryExitReportDTO {

    private String ticketCode;

    private String plate;

    private LocalDateTime timeIn;

    private LocalDateTime timeOut;

    private String status;
}