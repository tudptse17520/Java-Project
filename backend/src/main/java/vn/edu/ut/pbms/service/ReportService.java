package vn.edu.ut.pbms.service;

import java.util.List;

import vn.edu.ut.pbms.dto.report.OccupancyRateReportDTO;
import vn.edu.ut.pbms.dto.report.VehicleEntryExitReportDTO;

public interface ReportService {

    OccupancyRateReportDTO getOccupancyRate();

    List<VehicleEntryExitReportDTO> getVehicleEntryExitReport();
}