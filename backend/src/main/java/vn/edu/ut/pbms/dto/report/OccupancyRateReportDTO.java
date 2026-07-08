package vn.edu.ut.pbms.dto.report;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OccupancyRateReportDTO {

    @JsonProperty("average_occupancy_rate")
    private Double averageOccupancyRate;

    @JsonProperty("max_occupancy_rate")
    private Double maxOccupancyRate;

    private List<?> details;
}