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
public class PeakHourReportDTO {

    @JsonProperty("peak_hour")
    private String peakHour;

    @JsonProperty("vehicle_count")
    private int vehicleCount;

    private List<?> details;
}