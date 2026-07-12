"use client";

import { useVehicleFlowReport } from "../hooks/use-report";
import {
  AreaChart,
  Area,
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
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-neutral-200 dark:border-white/5 bg-background dark:bg-white/[0.02] transition-colors">
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
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorVao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#555555" opacity={0.3} />
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
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area
                  type="monotone"
                  name="Xe vào"
                  dataKey="vao"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVao)"
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  name="Xe ra"
                  dataKey="ra"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRa)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
