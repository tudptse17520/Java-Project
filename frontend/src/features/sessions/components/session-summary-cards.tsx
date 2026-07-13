import React from 'react';
import { Car, LogOut, Banknote, ParkingCircle } from 'lucide-react';

export function SessionSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Đang gửi */}
      <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Đang gửi</h3>
          <Car className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-bold">124</div>
        <p className="text-xs text-muted-foreground mt-1 text-emerald-500">
          +4% so với giờ trước
        </p>
      </div>

      {/* Đã ra hôm nay */}
      <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Đã ra hôm nay</h3>
          <LogOut className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-2xl font-bold">315</div>
        <p className="text-xs text-muted-foreground mt-1">
          Trung bình 45 xe/giờ
        </p>
      </div>

      {/* Doanh thu hôm nay */}
      <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Doanh thu hôm nay</h3>
          <Banknote className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold">12.5M</div>
        <p className="text-xs text-muted-foreground mt-1 text-emerald-500">
          +12% so với hôm qua
        </p>
      </div>

      {/* Chỗ trống */}
      <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Chỗ trống</h3>
          <ParkingCircle className="h-4 w-4 text-purple-500" />
        </div>
        <div className="text-2xl font-bold">68%</div>
        <p className="text-xs text-muted-foreground mt-1 text-rose-500">
          Tầng 1 sắp đầy
        </p>
      </div>
    </div>
  );
}
