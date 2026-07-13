"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, UserPlus, Settings, UserMinus, Edit, Building, Plus } from "lucide-react";
import { useActivityStore } from "@/stores/activity.store";

const iconMap: Record<string, any> = {
  UserPlus,
  UserMinus,
  Settings,
  ShieldAlert,
  Edit,
  Building,
  BuildingPlus: Plus,
};

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function AdminSystemActivity() {
  const activities = useActivityStore((state) => state.activities);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isMounted, setIsMounted] = useState(false);

  // Trigger a re-render every minute to update "time ago"
  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <Card className="col-span-1 shadow-sm border-white/5 bg-background">
      <CardHeader>
        <CardTitle>Nhật ký hệ thống</CardTitle>
        <CardDescription>
          Hoạt động quản trị gần đây
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {activities.map((activity) => {
            const Icon = iconMap[activity.icon] || Settings;
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`flex h-10 w-10 mt-0.5 shrink-0 items-center justify-center rounded-full ${activity.bg}`}>
                  <Icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getTimeAgo(activity.timestamp)}
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
