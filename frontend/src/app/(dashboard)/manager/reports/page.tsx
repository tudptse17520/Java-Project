"use client";

import { useState } from "react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { RevenueChart } from "@/features/reports/components/revenue-chart";
import { OccupancyChart } from "@/features/reports/components/occupancy-chart";
import { VehicleFlowChart } from "@/features/reports/components/vehicle-flow-chart";
import { PeakHoursChart } from "@/features/reports/components/peak-hours-chart";
import type { ReportFilter } from "@/features/reports/types/report.type";

export default function ReportsDashboardPage() {
    const [filter, setFilter] = useState<ReportFilter>({});

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start_date' | 'end_date') => {
        setFilter(prev => ({
            ...prev,
            [field]: e.target.value || undefined
        }));
    };

    return (
        <PageContainer>
            <PageHeader
                title="Báo cáo & Thống kê"
                description="Tổng quan doanh thu và chỉ số vận hành của bãi đỗ xe"
            />
            <Toolbar className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Từ ngày</label>
                    <input 
                        type="date" 
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={filter.start_date || ""}
                        onChange={(e) => handleDateChange(e, 'start_date')}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Đến ngày</label>
                    <input 
                        type="date" 
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={filter.end_date || ""}
                        onChange={(e) => handleDateChange(e, 'end_date')}
                    />
                </div>
            </Toolbar>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChart filter={filter} />
                <OccupancyChart filter={filter} />
                <VehicleFlowChart filter={filter} />
                <PeakHoursChart filter={filter} />
            </div>
        </PageContainer>
    );
}
