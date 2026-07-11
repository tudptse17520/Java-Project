export interface ReportFilter {
    start_date?: string; // Định dạng YYYY-MM-DD hoặc ISO
    end_date?: string;   // Định dạng YYYY-MM-DD hoặc ISO
    vehicle_type_id?: number;
}

export interface ReportDetail {
    name?: string;
    date?: string;
    value?: number;
    amount?: number;
    revenue?: number;
    entries?: number;
    exits?: number;
    vao?: number;
    ra?: number;
    [key: string]: unknown;
}

export interface DashboardReport {
    total_entries: number;
    total_exits: number;
    total_revenue: number;
    occupancy_rate: number;
    peak_hour: string;
    details: ReportDetail;
}

export interface RevenueReport {
    total_revenue: number;
    details: ReportDetail[];
}

export interface OccupancyRateReport {
    average_occupancy_rate: number;
    max_occupancy_rate: number;
    details: ReportDetail[];
}

export interface PeakHourReport {
    peak_hour: string;
    vehicle_count: number;
    details: ReportDetail[];
}

export interface VehicleEntryExitReport {
    total_entries: number;
    total_exits: number;
    details: ReportDetail[];
}
