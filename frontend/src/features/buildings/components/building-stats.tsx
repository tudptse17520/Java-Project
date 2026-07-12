"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle2, AlertTriangle, Car } from "lucide-react";

export function BuildingStats() {
  const stats = [
    { label: "Tòa nhà", value: "5", icon: Building2, color: "text-blue-500" },
    { label: "Đang hoạt động", value: "4", icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Bảo trì", value: "1", icon: AlertTriangle, color: "text-amber-500" },
    { label: "Tổng chỗ đỗ", value: "850", icon: Car, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 flex items-center justify-center rounded-full bg-muted/50`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
