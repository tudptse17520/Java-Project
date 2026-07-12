"use client";

import { useDashboardReport } from "@/features/reports/hooks/use-report";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Banknote, Car, CarFront, Clock, Percent } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

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
          <LoadingSpinner />
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
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">Tổng doanh thu hệ thống</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lượt xe vào</CardTitle>
              <CarFront className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalEntries || 0}</div>
              <p className="text-xs text-muted-foreground">Lượt xe đã check-in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lượt xe ra</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalExits || 0}</div>
              <p className="text-xs text-muted-foreground">Lượt xe đã check-out</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(data.occupancyRate || 0).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Hiệu suất sử dụng bãi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giờ cao điểm</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.peakHour || "--:--"}</div>
              <p className="text-xs text-muted-foreground">Khung giờ đông nhất</p>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}