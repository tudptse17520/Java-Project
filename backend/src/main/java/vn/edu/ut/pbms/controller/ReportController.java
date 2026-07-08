package vn.edu.ut.pbms.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.ut.pbms.dto.report.OccupancyRateReportDTO;
import vn.edu.ut.pbms.dto.report.PeakHourReportDTO;
import vn.edu.ut.pbms.dto.report.RevenueReportDTO;
import vn.edu.ut.pbms.dto.report.VehicleEntryExitReportDTO;
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

    @GetMapping("/vehicle-entry-exit")
    public List<VehicleEntryExitReportDTO> getVehicleEntryExitReport() {
        return reportService.getVehicleEntryExitReport();
    }

    @GetMapping("/revenue")
    public RevenueReportDTO getRevenueReport() {
        return reportService.getRevenueReport();
    }

    @GetMapping("/peak-hour")
    public List<PeakHourReportDTO> getPeakHourReport() {
        return reportService.getPeakHourReport();
    }
}