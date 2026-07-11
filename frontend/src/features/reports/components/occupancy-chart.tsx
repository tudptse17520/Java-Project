import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOccupancyReport } from "../hooks/use-report";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/common/empty-state";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Layers } from "lucide-react";

export function OccupancyChart() {
  const { data, isLoading, isError } = useOccupancyReport();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tỷ lệ lấp đầy</CardTitle>
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
          <CardTitle>Tỷ lệ lấp đầy</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <EmptyState 
             icon={Layers}
             title="Lỗi tải dữ liệu"
             description="Không thể tải thống kê tỷ lệ lấp đầy lúc này."
             actionLabel="Thử lại"
             onAction={() => window.location.reload()}
          />
        </CardContent>
      </Card>
    );
  }

  const rate = data.average_occupancy_rate || 0;
  const chartData = [
    { name: "Đã lấp đầy", value: rate },
    { name: "Trống", value: 100 - rate }
  ];

  const COLORS = ['var(--color-primary, #16a34a)', 'var(--muted, #f1f5f9)'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tỷ lệ lấp đầy</CardTitle>
        <CardDescription>
          Trung bình: <span className="font-bold text-primary">{rate.toFixed(1)}%</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Tỷ lệ"]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
