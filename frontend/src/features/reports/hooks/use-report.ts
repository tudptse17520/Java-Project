import { useQuery } from "@tanstack/react-query";
import {
  getDashboardReport,
  getRevenueReport,
  getOccupancyRateReport,
  getPeakHourReport,
  getVehicleEntryExitReport,
} from "@/services/report.service";
import type { ReportFilter } from "../types/report.type";

const REPORT_KEYS = {
  all: ["reports"] as const,
  dashboard: (filter: ReportFilter) => [...REPORT_KEYS.all, "dashboard", filter] as const,
  revenue: (filter: ReportFilter) => [...REPORT_KEYS.all, "revenue", filter] as const,
  occupancy: (filter: ReportFilter) => [...REPORT_KEYS.all, "occupancy", filter] as const,
  peakHour: (filter: ReportFilter) => [...REPORT_KEYS.all, "peak-hour", filter] as const,
  vehicleFlow: (filter: ReportFilter) => [...REPORT_KEYS.all, "vehicle-flow", filter] as const,
};

export const useDashboardReport = (filter: ReportFilter = {}) => {
  return useQuery({
    queryKey: REPORT_KEYS.dashboard(filter),
    queryFn: () => getDashboardReport(filter),
  });
};

export const useRevenueReport = (filter: ReportFilter = {}) => {
  return useQuery({
    queryKey: REPORT_KEYS.revenue(filter),
    queryFn: () => getRevenueReport(filter),
  });
};

export const useOccupancyReport = (filter: ReportFilter = {}) => {
  return useQuery({
    queryKey: REPORT_KEYS.occupancy(filter),
    queryFn: () => getOccupancyRateReport(filter),
  });
};

export const usePeakHourReport = (filter: ReportFilter = {}) => {
  return useQuery({
    queryKey: REPORT_KEYS.peakHour(filter),
    queryFn: () => getPeakHourReport(filter),
  });
};

export const useVehicleFlowReport = (filter: ReportFilter = {}) => {
  return useQuery({
    queryKey: REPORT_KEYS.vehicleFlow(filter),
    queryFn: () => getVehicleEntryExitReport(filter),
  });
};
