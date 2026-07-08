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
public class VehicleEntryExitReportDTO {

    @JsonProperty("total_entries")
    private int totalEntries;

    @JsonProperty("total_exits")
    private int totalExits;

    private List<?> details;
}