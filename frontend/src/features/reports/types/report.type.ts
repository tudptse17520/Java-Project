export interface ReportFilter {
    start_date?: string; // Định dạng YYYY-MM-DD hoặc ISO
    end_date?: string;   // Định dạng YYYY-MM-DD hoặc ISO
    vehicle_type_id?: number;
}

export interface DashboardReport {
    total_entries: number;
    total_exits: number;
    total_revenue: number;
    occupancy_rate: number;
    peak_hour: string;
    details: any;
}

export interface RevenueReport {
    total_revenue: number;
    details: any[];
}

export interface OccupancyRateReport {
    average_occupancy_rate: number;
    max_occupancy_rate: number;
    details: any[];
}

export interface PeakHourReport {
    peak_hour: string;
    vehicle_count: number;
    details: any[];
}

export interface VehicleEntryExitReport {
    total_entries: number;
    total_exits: number;
    details: any[];
}
