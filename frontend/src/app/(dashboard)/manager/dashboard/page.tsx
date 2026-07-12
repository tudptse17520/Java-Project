"use client";

import { useDashboardReport } from "@/features/reports/hooks/use-report";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Banknote, Car, CarFront, Clock, Percent } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { DashboardCharts } from "@/features/reports/components/dashboard-charts";
import { DashboardRecentActivity } from "@/features/reports/components/dashboard-recent-activity";

const statCards = [
  {
    key: "revenue",
    label: "Doanh thu",
    description: "Tổng doanh thu hệ thống",
    icon: Banknote,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "entries",
    label: "Lượt xe vào",
    description: "Lượt xe đã check-in",
    icon: CarFront,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    key: "exits",
    label: "Lượt xe ra",
    description: "Lượt xe đã check-out",
    icon: Car,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    key: "occupancy",
    label: "Tỷ lệ lấp đầy",
    description: "Hiệu suất sử dụng bãi",
    icon: Percent,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    key: "peak",
    label: "Giờ cao điểm",
    description: "Khung giờ đông nhất",
    icon: Clock,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
] as const;

function getStatValue(key: string, data: Record<string, unknown>): string {
  switch (key) {
    case "revenue":
      return formatCurrency((data.totalRevenue as number) || 0);
    case "entries":
      return String((data.totalEntries as number) || 0);
    case "exits":
      return String((data.totalExits as number) || 0);
    case "occupancy":
      return `${((data.occupancyRate as number) || 0).toFixed(1)}%`;
    case "peak":
      return (data.peakHour as string) || "--:--";
    default:
      return "--";
  }
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useDashboardReport();

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard Quản Trị"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.key} className="group relative overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {card.label}
                        </p>
                        <p className="text-2xl font-bold tracking-tight">
                          {getStatValue(card.key, data as unknown as Record<string, unknown>)}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          {card.description}
                        </p>
                      </div>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DashboardCharts />
            <DashboardRecentActivity />
          </div>
        </>
      )}
    </PageContainer>
  );
}