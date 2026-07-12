"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, LogIn, LogOut, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";

const RECENT_ACTIVITIES = [
  { id: 1, type: "entry", plate: "51F-123.45", time: "Vừa xong", icon: LogIn, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, type: "exit", plate: "29A-678.90", time: "5 phút trước", icon: LogOut, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 3, type: "payment", plate: "51G-111.22", time: "12 phút trước", amount: 50000, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 4, type: "entry", plate: "60B-333.44", time: "18 phút trước", icon: LogIn, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 5, type: "entry", plate: "61C-555.66", time: "30 phút trước", icon: LogIn, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export function DashboardRecentActivity() {
  return (
    <Card className="col-span-1 shadow-sm border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>
          Luồng giao dịch và xe cộ mới nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-4">
          {RECENT_ACTIVITIES.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.bg}`}>
                  <Icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Xe {activity.plate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type === 'entry' ? 'Đã vào bãi đỗ' : activity.type === 'exit' ? 'Đã rời bãi đỗ' : 'Thanh toán phí đỗ xe'}
                  </p>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(activity.amount)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
