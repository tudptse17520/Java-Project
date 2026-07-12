"use client";

import { useVehicleFlowReport } from "../hooks/use-report";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/loading-spinner";

const MOCK_DATA = [
  { time: "06:00", vao: 12, ra: 2 },
  { time: "08:00", vao: 45, ra: 15 },
  { time: "10:00", vao: 30, ra: 28 },
  { time: "12:00", vao: 15, ra: 40 },
  { time: "14:00", vao: 22, ra: 20 },
  { time: "16:00", vao: 50, ra: 35 },
  { time: "18:00", vao: 18, ra: 65 },
];

export function DashboardCharts() {
  const { data, isLoading, isError } = useVehicleFlowReport();

  const chartData = (!isError && data?.details?.length) ? data.details : MOCK_DATA;

  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle>Lưu lượng xe trong ngày</CardTitle>
        <CardDescription>
          Thống kê số lượng xe vào và ra theo thời gian
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }} 
                  dx={-10} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  name="Xe vào"
                  dataKey="vao"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  name="Xe ra"
                  dataKey="ra"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
