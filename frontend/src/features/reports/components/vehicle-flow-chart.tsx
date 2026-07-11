import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicleFlowReport } from "../hooks/use-report";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/common/empty-state";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Activity } from "lucide-react";
import type { ReportFilter } from "../types/report.type";

interface VehicleFlowChartProps {
  filter?: ReportFilter;
}

export function VehicleFlowChart({ filter }: VehicleFlowChartProps) {
  const { data, isLoading, isError } = useVehicleFlowReport(filter);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lưu lượng xe vào/ra</CardTitle>
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
          <CardTitle>Lưu lượng xe</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <EmptyState 
             icon={Activity}
             title="Lỗi tải dữ liệu"
             description="Không thể tải thống kê lưu lượng xe lúc này."
             actionLabel="Thử lại"
             onAction={() => window.location.reload()}
          />
        </CardContent>
      </Card>
    );
  }

  // Assuming details has { name/date, entries, exits }
  const chartData = data.details?.length > 0 ? data.details.map((d: any) => ({
    name: d.name || d.date || "Unknown",
    entries: d.entries || d.vao || 0,
    exits: d.exits || d.ra || 0,
  })) : [
    { name: "Tổng quan", entries: data.total_entries, exits: data.total_exits }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lưu lượng xe vào/ra</CardTitle>
        <CardDescription>
          Vào: <span className="font-bold text-green-600">{data.total_entries}</span> | 
          Ra: <span className="font-bold text-red-500">{data.total_exits}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }} />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="entries" name="Lượt vào" stroke="#16a34a" fillOpacity={1} fill="url(#colorEntries)" />
              <Area type="monotone" dataKey="exits" name="Lượt ra" stroke="#ef4444" fillOpacity={1} fill="url(#colorExits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
