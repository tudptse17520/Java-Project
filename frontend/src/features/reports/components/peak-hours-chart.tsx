import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePeakHourReport } from "../hooks/use-report";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/common/empty-state";
import { Clock, CarFront, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportFilter } from "../types/report.type";

interface PeakHoursChartProps {
  filter?: ReportFilter;
}

export function PeakHoursChart({ filter }: PeakHoursChartProps) {
  const { data, isLoading, isError } = usePeakHourReport(filter);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Khung giờ cao điểm</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Khung giờ cao điểm</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <EmptyState 
             icon={Clock}
             title="Lỗi tải dữ liệu"
             description="Không thể tải thống kê giờ cao điểm lúc này."
             action={
               <Button variant="outline" onClick={() => window.location.reload()}>
                 Thử lại
               </Button>
             }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khung giờ cao điểm</CardTitle>
        <CardDescription>
          Khoảng thời gian có lượng xe đông nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex flex-col items-center justify-center space-y-4">
          <div className="p-6 bg-primary/10 rounded-full">
            <Clock className="w-16 h-16 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-bold text-foreground">
              {data.peakHour || "N/A"}
            </h3>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium">
                <CarFront className="w-4 h-4" />
                {data.vehicleCount} xe
              </span>
              <span className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Tăng 12%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
