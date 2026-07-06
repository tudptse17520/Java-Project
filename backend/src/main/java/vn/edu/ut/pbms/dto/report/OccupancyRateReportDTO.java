package vn.edu.ut.pbms.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OccupancyRateReportDTO {

    private long totalSlots;

    private long occupiedSlots;

    private long availableSlots;

    private double occupancyRate;

}