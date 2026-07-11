// ---------------------------------------------
// Report Service
// Gọi API Reports qua axiosClient
// ---------------------------------------------

import axiosClient from "@/lib/axios-client";

import type {
    ReportFilter,
    RevenueReport,
    OccupancyRateReport,
    PeakHourReport,
    VehicleEntryExitReport,
} from "@/features/reports/types/report.type";

const BASE_PATH = "/reports";

/**
 * Revenue Report
 */
export const getRevenueReport = async (
    filter?: ReportFilter
): Promise<RevenueReport> => {
    const params: Record<string, string | number> = {};

    if (filter?.start_date) params.start_date = filter.start_date;
    if (filter?.end_date) params.end_date = filter.end_date;
    if (filter?.vehicle_type_id)
        params.vehicle_type_id = filter.vehicle_type_id;

    const response = await axiosClient.get<RevenueReport>(
        `${BASE_PATH}/revenue`,
        {
            params,
        }
    );

    return response.data;
};

/**
 * Occupancy Rate Report
 */
export const getOccupancyRateReport = async (
    filter?: ReportFilter
): Promise<OccupancyRateReport> => {
    const params: Record<string, string | number> = {};

    if (filter?.start_date) params.start_date = filter.start_date;
    if (filter?.end_date) params.end_date = filter.end_date;
    if (filter?.vehicle_type_id)
        params.vehicle_type_id = filter.vehicle_type_id;

    const response = await axiosClient.get<OccupancyRateReport>(
        `${BASE_PATH}/occupancy-rate`,
        {
            params,
        }
    );

    return response.data;
};

/**
 * Peak Hour Report
 */
export const getPeakHourReport = async (
    filter?: ReportFilter
): Promise<PeakHourReport> => {
    const params: Record<string, string | number> = {};

    if (filter?.start_date) params.start_date = filter.start_date;
    if (filter?.end_date) params.end_date = filter.end_date;
    if (filter?.vehicle_type_id)
        params.vehicle_type_id = filter.vehicle_type_id;

    const response = await axiosClient.get<PeakHourReport>(
        `${BASE_PATH}/peak-hours`,
        {
            params,
        }
    );

    return response.data;
};

/**
 * Vehicle Entry / Exit Report
 */
export const getVehicleEntryExitReport = async (
    filter?: ReportFilter
): Promise<VehicleEntryExitReport> => {
    const params: Record<string, string | number> = {};

    if (filter?.start_date) params.start_date = filter.start_date;
    if (filter?.end_date) params.end_date = filter.end_date;
    if (filter?.vehicle_type_id)
        params.vehicle_type_id = filter.vehicle_type_id;

    const response = await axiosClient.get<VehicleEntryExitReport>(
        `${BASE_PATH}/vehicle-entry-exit`,
        {
            params,
        }
    );

    return response.data;
};