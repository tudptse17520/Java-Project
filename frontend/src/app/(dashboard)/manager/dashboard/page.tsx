"use client";

import { useDashboardReport } from "@/features/reports/hooks/use-report";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Banknote, Car, CarFront, Percent, MapPin } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { DashboardCharts } from "@/features/reports/components/dashboard-charts";
import { DashboardRecentActivity } from "@/features/reports/components/dashboard-recent-activity";
import { DashboardKpiCards } from "@/features/reports/components/dashboard-kpi-cards";


export default function ManagerDashboardPage() {
  const { data, isLoading, isError } = useDashboardReport({}, 5000);

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard Quản Lý"
        description="Tổng quan tình hình vận hành của hệ thống bãi đỗ xe"
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner text="Đang tải dữ liệu..." />
        </div>
      ) : isError || !data ? (
        <div className="h-64 mt-6">
          <EmptyState
            icon={Car}
            title="Lỗi tải dữ liệu"
            description="Không thể kết nối để lấy dữ liệu tổng quan lúc này."
            action={
              <Button variant="outline" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <DashboardKpiCards data={data as unknown as Record<string, unknown>} />

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DashboardCharts />
            <DashboardRecentActivity />
          </div>
        </>
      )}
    </PageContainer>
  );
}