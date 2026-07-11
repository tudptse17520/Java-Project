import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCompactCurrency } from "@/utils/format-currency";
import { useRevenueReport } from "../hooks/use-report";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/common/empty-state";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";
import type { ReportFilter } from "../types/report.type";

interface RevenueChartProps {
  filter?: ReportFilter;
}

export function RevenueChart({ filter }: RevenueChartProps) {
  const { data, isLoading, isError } = useRevenueReport(filter);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
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
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <EmptyState 
             icon={BarChart3}
             title="Lỗi tải dữ liệu"
             description="Không thể tải dữ liệu doanh thu lúc này."
             actionLabel="Thử lại"
             onAction={() => window.location.reload()}
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.details?.map((d: any) => ({
    name: d.name || d.date || "Unknown",
    value: d.value || d.amount || d.revenue || 0,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        <CardDescription>
          Tổng doanh thu: <span className="font-bold text-primary">{formatCurrency(data.total_revenue)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
           <EmptyState 
              icon={BarChart3}
              title="Chưa có dữ liệu"
              description="Không có giao dịch nào trong khoảng thời gian này."
           />
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false} 
                   tickFormatter={(value) => formatCompactCurrency(value)}
                />
                <Tooltip 
                   formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                   cursor={{ fill: 'var(--muted)' }}
                />
                <Bar dataKey="value" fill="var(--color-primary, #16a34a)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
