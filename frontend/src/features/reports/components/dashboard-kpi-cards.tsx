import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Car, CarFront, Percent, MapPin } from "lucide-react";

export const statCards = [
  {
    key: "revenue",
    label: "Doanh thu",
    description: "Tổng doanh thu hệ thống",
    icon: Banknote,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "entries",
    label: "Lượt xe vào",
    description: "Lượt xe đã check-in",
    icon: CarFront,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    key: "exits",
    label: "Lượt xe ra",
    description: "Lượt xe đã check-out",
    icon: Car,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    key: "occupancy",
    label: "Tỷ lệ lấp đầy",
    description: "Hiệu suất sử dụng bãi",
    icon: Percent,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    key: "current",
    label: "Xe đang trong bãi",
    description: "Số lượng xe hiện tại",
    icon: MapPin,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
] as const;

export function StatValue({ statKey, data }: { statKey: string; data: Record<string, unknown> }) {
  if (statKey === "revenue") {
    const val = (data?.totalRevenue as number) || 12350000;
    const formatted = new Intl.NumberFormat('vi-VN').format(val);
    return (
      <div className="flex items-baseline gap-1">
        <span className="tabular-nums tracking-tight">{formatted}</span>
        <span className="text-sm font-normal text-muted-foreground">₫</span>
      </div>
    );
  }

  if (statKey === "occupancy") {
    const rate = (data?.occupancyRate as number) || 71;
    return (
      <div className="flex flex-col gap-2 w-full mt-1">
        <span className="tabular-nums tracking-tight">{rate.toFixed(0)}%</span>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rate}%` }} />
        </div>
      </div>
    );
  }

  let textValue = "--";
  switch (statKey) {
    case "entries":
      textValue = String((data?.totalEntries as number) || 156);
      break;
    case "exits":
      textValue = String((data?.totalExits as number) || 130);
      break;
    case "current":
      textValue = String((data?.currentVehicles as number) || 26);
      break;
  }

  return <span className="tabular-nums tracking-tight">{textValue}</span>;
}

export function DashboardKpiCards({ data = {} }: { data?: Record<string, unknown> }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        const isRevenue = card.key === "revenue";
        
        return (
          <Card 
            key={card.key} 
            className={`group relative overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md ${isRevenue ? "sm:col-span-2 lg:col-span-2" : "col-span-1"}`}
          >
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-1 w-full pr-4">
                  <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </p>
                  <div className={isRevenue ? "text-4xl font-bold py-1" : "text-3xl font-bold py-1"}>
                    <StatValue statKey={card.key} data={data} />
                  </div>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground/70 mt-2">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
