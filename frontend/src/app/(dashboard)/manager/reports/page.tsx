import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";

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
            
            <div className="mt-6 space-y-6">
                <div className="text-center p-10 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">Khu vực hiển thị các biểu đồ (Đang phát triển)</p>
                </div>
            </div>
        </PageContainer>
    );
}
