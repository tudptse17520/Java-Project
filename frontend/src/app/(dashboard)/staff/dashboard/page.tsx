"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CarFront, 
  Car, 
  MapPin, 
  LogOut, 
  LogIn,
  AlertCircle,
  CreditCard,
  Clock,
  ArrowRight,
  Activity
} from "lucide-react";
import dayjs from "dayjs";

const FLOORS = [
  { id: 1, name: "Tầng 1", capacity: 32 },
  { id: 2, name: "Tầng 2", capacity: 48 },
  { id: 3, name: "Tầng 3", capacity: 40 },
];

const INIT_ACTIVITIES = [
  { id: 1, type: "IN", plate: "51H-12345", time: dayjs().subtract(2, 'minute').format('HH:mm'), slot: "A-14", floor: "Tầng 1" },
  { id: 2, type: "OUT", plate: "30A-99999", time: dayjs().subtract(5, 'minute').format('HH:mm'), slot: "B-02", floor: "Tầng 2" },
  { id: 3, type: "INCIDENT", plate: "60C-22222", time: dayjs().subtract(15, 'minute').format('HH:mm'), desc: "Mất vé" },
];

const generateRandomPlate = () => {
  const prefixes = ["51", "30", "43", "60", "29"];
  const chars = ["F", "H", "G", "C", "A"];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${chars[Math.floor(Math.random() * chars.length)]}-${Math.floor(10000 + Math.random() * 90000)}`;
};

export default function StaffDashboardPage() {
  const [activeFloor, setActiveFloor] = useState(1);
  const [activities, setActivities] = useState(INIT_ACTIVITIES);
  const [stats, setStats] = useState({ occupied: 142, capacity: 189, inToday: 86, incidents: 2 });

  // Simulate Real-time Data
  useEffect(() => {
    const interval = setInterval(() => {
      const isIncoming = Math.random() > 0.5;
      const newActivity = {
        id: Date.now(),
        type: isIncoming ? "IN" : "OUT",
        plate: generateRandomPlate(),
        time: dayjs().format('HH:mm'),
        slot: `${['A','B','C'][Math.floor(Math.random()*3)]}-${Math.floor(Math.random()*20)+1}`,
        floor: `Tầng ${Math.floor(Math.random() * 3) + 1}`,
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10
      setStats(prev => ({
        ...prev,
        occupied: isIncoming ? Math.min(prev.occupied + 1, prev.capacity) : Math.max(prev.occupied - 1, 0),
        inToday: isIncoming ? prev.inToday + 1 : prev.inToday
      }));
    }, 8000); // New activity every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const activeFloorData = FLOORS.find(f => f.id === activeFloor);

  return (
    <PageContainer>
      <PageHeader
        title="Staff Dashboard"
        description="Tổng quan hoạt động bãi xe theo thời gian thực."
      />

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-emerald-200 dark:border-emerald-800 relative overflow-hidden bg-emerald-50/50 dark:bg-emerald-900/10">
          <div className="absolute top-0 right-0 p-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Công suất bãi
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {stats.capacity - stats.occupied}
                  </p>
                  <span className="text-sm font-semibold text-emerald-600/70 dark:text-emerald-400/70">trống</span>
                </div>
              </div>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-emerald-500/20">
                <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/50 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(stats.occupied / stats.capacity) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-400/80 mt-2 flex justify-between">
              <span>Đã đầy: <span className="text-emerald-800 dark:text-emerald-300 font-bold">{stats.occupied}</span>/{stats.capacity}</span>
              <span>{(stats.occupied / stats.capacity * 100).toFixed(0)}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between h-full">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Lượt xe vào hôm nay
              </p>
              <p className="text-3xl font-bold tracking-tight">{stats.inToday}</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-500/10">
              <LogIn className="h-6 w-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between h-full">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Đang giao dịch
              </p>
              <p className="text-3xl font-bold tracking-tight">3</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500/10">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between h-full">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sự cố
              </p>
              <p className="text-3xl font-bold tracking-tight">{stats.incidents}</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-rose-500/10">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        
        {/* Left Col: Actions & Map */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/staff/check-in" className="block">
              <Button className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" variant="default">
                <LogIn className="h-6 w-6" />
                <span className="text-xs font-bold uppercase">Xe Vào</span>
              </Button>
            </Link>
            <Link href="/staff/check-out" className="block">
              <Button className="w-full h-20 flex flex-col items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white" variant="default">
                <LogOut className="h-6 w-6" />
                <span className="text-xs font-bold uppercase">Xe Ra</span>
              </Button>
            </Link>
            <Link href="/staff/sessions" className="block">
              <Button className="w-full h-20 flex flex-col items-center justify-center gap-1.5" variant="outline">
                <CarFront className="h-6 w-6 text-blue-500" />
                <span className="text-xs font-bold uppercase">Lượt Gửi</span>
              </Button>
            </Link>
            <Link href="/staff/payments" className="block">
              <Button className="w-full h-20 flex flex-col items-center justify-center gap-1.5" variant="outline">
                <CreditCard className="h-6 w-6 text-amber-500" />
                <span className="text-xs font-bold uppercase">Thanh Toán</span>
              </Button>
            </Link>
          </div>

          {/* Floor Map */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
              <CardTitle className="text-base font-semibold">Bản đồ Bãi đỗ</CardTitle>
              <div className="flex gap-2 bg-muted p-1 rounded-lg">
                {FLOORS.map(floor => (
                  <button
                    key={floor.id}
                    onClick={() => setActiveFloor(floor.id)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                      activeFloor === floor.id 
                        ? 'bg-background shadow text-foreground font-bold' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {floor.name}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {Array.from({ length: activeFloorData?.capacity || 40 }).map((_, i) => {
                  // Giữ nguyên trạng thái ngẫu nhiên theo ID tầng và index để không bị giật khi re-render
                  const isOccupied = ((i + 1) * activeFloor * 7) % 5 !== 0; 
                  return (
                    <div 
                      key={`${activeFloor}-${i}`} 
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                        isOccupied 
                          ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-400' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400'
                      }`}
                    >
                      <span className="text-xs font-bold mb-1">
                        {['A','B','C'][activeFloor - 1]}-{i + 1}
                      </span>
                      {isOccupied ? <Car className="h-5 w-5 opacity-70" /> : <span className="text-[10px] font-medium uppercase tracking-wider">Trống</span>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Activity Feed */}
        <Card className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`flex gap-4 p-3 rounded-xl border bg-card transition-all duration-500 ${
                    index === 0 ? 'animate-in slide-in-from-right-4 fade-in shadow-md ring-1 ring-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="mt-0.5">
                    {activity.type === 'IN' ? (
                      <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/50 dark:text-emerald-400">
                        <LogIn className="h-4 w-4" />
                      </div>
                    ) : activity.type === 'OUT' ? (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center dark:bg-indigo-900/50 dark:text-indigo-400">
                        <LogOut className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center dark:bg-rose-900/50 dark:text-rose-400">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm">{activity.plate}</p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </span>
                    </div>
                    
                    {activity.type === 'INCIDENT' ? (
                      <p className="text-xs text-rose-600 font-medium">{activity.desc}</p>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-normal text-[10px] h-5">{activity.floor}</Badge>
                        <ArrowRight className="h-3 w-3" />
                        <span className="font-medium text-foreground">{activity.slot}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </PageContainer>
  );
}
