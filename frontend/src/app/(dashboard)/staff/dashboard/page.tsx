"use client";

import Link from "next/link";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CarFront, 
  Car, 
  MapPin, 
  LogOut, 
  LogIn,
  AlertCircle,
  CreditCard
} from "lucide-react";

export default function StaffDashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Staff Dashboard"
        description="Tổng quan hoạt động bãi xe và các thao tác nhanh."
      />

      <div className="mt-6 space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/staff/check-in" className="block">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" variant="default">
                <LogIn className="h-8 w-8" />
                <span className="text-sm font-semibold">Check-in Xe Vào</span>
              </Button>
            </Link>
            
            <Link href="/staff/check-out" className="block">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" variant="default">
                <LogOut className="h-8 w-8" />
                <span className="text-sm font-semibold">Check-out Xe Ra</span>
              </Button>
            </Link>

            <Link href="/staff/sessions" className="block">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="outline">
                <CarFront className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-semibold">Lượt Gửi Xe</span>
              </Button>
            </Link>

            <Link href="/staff/payments" className="block">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="outline">
                <CreditCard className="h-8 w-8 text-amber-500" />
                <span className="text-sm font-semibold">Thanh Toán</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Thông số trong ca làm việc</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Đang gửi
                  </p>
                  <p className="text-2xl font-bold tracking-tight">142</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500/10">
                  <Car className="h-5 w-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Công suất bãi (Đã dùng)
                    </p>
                    <p className="text-2xl font-bold tracking-tight">75%</p>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500/10">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">142 / 189 slots đang có xe</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Lượt xe vào
                  </p>
                  <p className="text-2xl font-bold tracking-tight">86</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500/10">
                  <LogIn className="h-5 w-5 text-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sự cố
                  </p>
                  <p className="text-2xl font-bold tracking-tight">2</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-rose-500/10">
                  <AlertCircle className="h-5 w-5 text-rose-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Capacity Map (Mocking some floors) */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tình trạng bãi đỗ (Tầng 1)</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: 32 }).map((_, i) => {
              const isOccupied = Math.random() > 0.4;
              return (
                <div 
                  key={i} 
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                    isOccupied 
                      ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-400' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400'
                  }`}
                >
                  <span className="text-xs font-bold mb-1">A-{i + 1}</span>
                  {isOccupied ? <Car className="h-5 w-5 opacity-70" /> : <span className="text-xs font-medium">Trống</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
