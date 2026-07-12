package vn.edu.ut.pbms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import vn.edu.ut.pbms.dto.report.*;
import vn.edu.ut.pbms.service.ReportService;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
@Tag(name = "Reports & Dashboard", description = "API kết xuất các báo cáo và chỉ số Dashboard")
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "Thống kê và đối soát doanh thu")
    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDTO> getRevenueReport(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate) {
        RevenueReportDTO response = reportService.getRevenueReport(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Xem báo cáo lượt xe vào/ra")
    @GetMapping("/vehicle-flow")
    public ResponseEntity<VehicleEntryExitReportDTO> getVehicleFlowReport(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "vehicleTypeId", required = false) Long vehicleTypeId) {
        VehicleEntryExitReportDTO response = reportService.getVehicleEntryExitReport(startDate, endDate, vehicleTypeId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Xem tỷ lệ lấp đầy")
    @GetMapping("/occupancy")
    public ResponseEntity<OccupancyRateReportDTO> getOccupancyReport(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "vehicleTypeId", required = false) Long vehicleTypeId) {
        OccupancyRateReportDTO response = reportService.getOccupancyRateReport(startDate, endDate, vehicleTypeId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Xem khung giờ cao điểm")
    @GetMapping("/peak-hours")
    public ResponseEntity<PeakHourReportDTO> getPeakHourReport(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "vehicleTypeId", required = false) Long vehicleTypeId) {
        PeakHourReportDTO response = reportService.getPeakHourReport(startDate, endDate, vehicleTypeId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Xem Dashboard tổng quan")
    @GetMapping
    public ResponseEntity<DashboardReportDTO> getDashboardReport(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "vehicleTypeId", required = false) Long vehicleTypeId) {
        DashboardReportDTO response = reportService.getDashboardReport(startDate, endDate, vehicleTypeId);
        return ResponseEntity.ok(response);
    }
}