package vn.edu.ut.pbms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.ut.pbms.dto.report.OccupancyRateReportDTO;
import vn.edu.ut.pbms.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/occupancy-rate")
    public OccupancyRateReportDTO getOccupancyRate() {
        return reportService.getOccupancyRate();
    }
}