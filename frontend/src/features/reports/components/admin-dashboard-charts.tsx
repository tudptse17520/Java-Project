"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ROLE_DATA = [
  { name: "Admin", users: 1 },
  { name: "Manager", users: 3 },
  { name: "Staff", users: 5 },
  { name: "User", users: 120 },
];

export function AdminDashboardCharts() {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-white/5 bg-background">
      <CardHeader>
        <CardTitle>Phân bố Tài khoản theo Vai trò</CardTitle>
        <CardDescription>
          Thống kê số lượng người dùng đang hoạt động
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ROLE_DATA}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
              <XAxis 
                dataKey="name" 
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
                cursor={{ fill: '#88888811' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar
                dataKey="users"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
