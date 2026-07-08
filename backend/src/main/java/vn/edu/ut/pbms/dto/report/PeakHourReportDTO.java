package vn.edu.ut.pbms.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeakHourReportDTO {

    private int hour;

    private long vehicleCount;

}