package vn.edu.ut.pbms.dto.report;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OccupancyRateReportDTO {
    private Double averageOccupancyRate;
    private Double maxOccupancyRate;

    private List<?> details;
}