"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Car, Clock, MapPin } from "lucide-react";
import { useSlots } from "@/features/slots/hooks/use-slots";

export function SlotStats() {
  const { data: slotsResponse } = useSlots();
  const slots = slotsResponse?.data || [];

  const total = slots.length;
  const available = slots.filter((s: any) => s.status === 'AVAILABLE').length;
  const occupied = slots.filter((s: any) => s.status === 'OCCUPIED').length;
  const reserved = slots.filter((s: any) => s.status === 'RESERVED').length;
  const maintenance = slots.filter((s: any) => s.status === 'MAINTENANCE').length;

  const stats = [
    { label: "Tổng số chỗ", value: total.toString(), icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Còn trống", value: available.toString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Đang đỗ", value: occupied.toString(), icon: MapPin, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Đặt trước", value: reserved.toString(), icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Bảo trì", value: maintenance.toString(), icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`h-8 w-8 flex items-center justify-center rounded-full ${stat.bg}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
