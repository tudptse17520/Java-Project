package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.report.DashboardReportDTO;
import vn.edu.ut.pbms.dto.report.OccupancyRateReportDTO;
import vn.edu.ut.pbms.dto.report.PeakHourReportDTO;
import vn.edu.ut.pbms.dto.report.RevenueReportDTO;
import vn.edu.ut.pbms.dto.report.VehicleEntryExitReportDTO;

public interface ReportService {

    RevenueReportDTO getRevenueReport(String startDate, String endDate);

    VehicleEntryExitReportDTO getVehicleEntryExitReport(String startDate, String endDate, Long vehicleTypeId);

    OccupancyRateReportDTO getOccupancyRateReport(String startDate, String endDate, Long vehicleTypeId);

    PeakHourReportDTO getPeakHourReport(String startDate, String endDate, Long vehicleTypeId);

    DashboardReportDTO getDashboardReport(String startDate, String endDate, Long vehicleTypeId);
}