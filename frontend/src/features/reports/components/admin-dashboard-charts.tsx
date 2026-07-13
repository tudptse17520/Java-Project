"use client";

import { useMemo } from "react";
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
import { useUsers } from "@/features/users/hooks/use-users";
import { UserResponse } from "@/types/user.type";

export function AdminDashboardCharts() {
  const { data: usersData } = useUsers();

  const roleData = useMemo(() => {
    const users = usersData?.data || [];
    let admin = 0, manager = 0, staff = 0, user = 0;
    
    users.forEach((u: UserResponse) => {
      // The chart description says "Thống kê số lượng người dùng đang hoạt động"
      // So we might only count ACTIVE users, but to be safe and match the old mock data, we count all or just ACTIVE.
      if (u.status !== "ACTIVE") return;

      if (u.role === "ADMIN") admin++;
      else if (u.role === "MANAGER") manager++;
      else if (u.role === "STAFF") staff++;
      else if (u.role === "USER") user++;
    });

    return [
      { name: "Admin", users: admin },
      { name: "Manager", users: manager },
      { name: "Staff", users: staff },
      { name: "User", users: user },
    ];
  }, [usersData]);

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
              data={roleData}
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
