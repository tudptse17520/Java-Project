import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { RevenueChart } from "@/features/reports/components/revenue-chart";
import { OccupancyChart } from "@/features/reports/components/occupancy-chart";

export default function ReportsDashboardPage() {
    return (
        <PageContainer>
            <PageHeader
                title="Báo cáo & Thống kê"
                description="Tổng quan doanh thu và chỉ số vận hành của bãi đỗ xe"
            />
            <Toolbar>
                <div className="text-sm text-muted-foreground">
                    Bộ lọc báo cáo sẽ được hiển thị ở đây.
                </div>
            </Toolbar>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChart />
                <OccupancyChart />
            </div>
        </PageContainer>
    );
}
