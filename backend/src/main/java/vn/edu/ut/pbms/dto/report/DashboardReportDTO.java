package vn.edu.ut.pbms.dto.report;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardReportDTO {

    @JsonProperty("total_entries")
    private int totalEntries;

    @JsonProperty("total_exits")
    private int totalExits;

    @JsonProperty("total_revenue")
    private BigDecimal totalRevenue;

    @JsonProperty("occupancy_rate")
    private Double occupancyRate;

    @JsonProperty("peak_hour")
    private String peakHour;

    private Object details;
}
