"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { DateRangePicker } from "@/components/common/date-range-picker";
import { DashboardKpiCards } from "@/features/reports/components/dashboard-kpi-cards";
import { RevenueChart } from "@/features/reports/components/revenue-chart";
import { OccupancyChart } from "@/features/reports/components/occupancy-chart";
import { VehicleFlowChart } from "@/features/reports/components/vehicle-flow-chart";
import { PeakHoursChart } from "@/features/reports/components/peak-hours-chart";
import type { ReportFilter } from "@/features/reports/types/report.type";

export default function ReportsDashboardPage() {
    const [filter, setFilter] = useState<ReportFilter>({});

    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        setFilter(prev => ({
            ...prev,
            startDate: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
            endDate: range?.to ? format(range.to, "yyyy-MM-dd") : undefined
        }));
    };

    return (
        <PageContainer>
            <PageHeader
                title="Báo cáo & Thống kê"
                description="Tổng quan doanh thu và chỉ số vận hành của bãi đỗ xe"
            />
            <div className="flex justify-between items-center mb-6">
                <div></div>
                <div className="flex items-center space-x-4">
                    <DateRangePicker 
                        date={dateRange}
                        onDateChange={handleDateRangeChange}
                    />
                </div>
            </div>

            <DashboardKpiCards />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChart filter={filter} />
                <OccupancyChart filter={filter} />
                <VehicleFlowChart filter={filter} />
                <PeakHoursChart filter={filter} />
            </div>
        </PageContainer>
    );
}
