"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, LogOut, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { useSessions } from "@/features/sessions/hooks/use-sessions";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { LoadingSpinner } from "@/components/common/loading-spinner";

function getRelativeTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  } catch (e) {
    return dateStr;
  }
}

export function DashboardRecentActivity() {
  const { data, isLoading } = useSessions({ refetchInterval: 5000 });
  const sessions = data?.data || [];

  const activities: any[] = [];
  
  sessions.forEach(session => {
    activities.push({
      id: `entry-${session.id}`,
      type: "entry",
      plate: session.plate,
      time: getRelativeTime(session.timeIn),
      timestamp: new Date(session.timeIn).getTime(),
      icon: LogIn,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    });
    
    if (session.status === 'COMPLETED' && session.timeOut) {
      const isPayment = session.totalFee && session.totalFee > 0;
      activities.push({
        id: `exit-${session.id}`,
        type: isPayment ? "payment" : "exit",
        plate: session.plate,
        time: getRelativeTime(session.timeOut),
        timestamp: new Date(session.timeOut).getTime(),
        amount: session.totalFee,
        icon: isPayment ? CreditCard : LogOut,
        color: isPayment ? "text-emerald-500" : "text-purple-500",
        bg: isPayment ? "bg-emerald-500/10" : "bg-purple-500/10",
      });
    }
  });

  activities.sort((a, b) => b.timestamp - a.timestamp);
  const recentActivities = activities.slice(0, 5);

  return (
    <Card className="col-span-1 shadow-sm border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>
          Luồng giao dịch và xe cộ mới nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Chưa có hoạt động nào
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.bg}`}>
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold tracking-tight text-foreground">
                      Xe {activity.plate}
                    </p>
                    <p className={`text-xs ${
                      activity.type === 'entry' ? 'text-blue-500/80 dark:text-blue-400/80' : 
                      activity.type === 'exit' ? 'text-purple-500/80 dark:text-purple-400/80' : 
                      'text-emerald-500/80 dark:text-emerald-400/80'
                    }`}>
                      {activity.type === 'entry' ? 'Đã vào bãi đỗ' : activity.type === 'exit' ? 'Đã rời bãi đỗ' : 'Thanh toán phí đỗ xe'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-center min-w-[80px]">
                    {activity.amount && (
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5 tabular-nums">
                        +{formatCurrency(activity.amount)}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
