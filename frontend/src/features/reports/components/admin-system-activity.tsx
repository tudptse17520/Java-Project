"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, UserPlus, Settings, UserMinus } from "lucide-react";

const SYSTEM_ACTIVITIES = [
  { id: 1, type: "create_user", title: "Manager Nguyễn Văn A tạo tài khoản Staff", time: "10 phút trước", icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 2, type: "block_user", title: "Tài khoản user_01 bị khóa", time: "20 phút trước", icon: UserMinus, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: 3, type: "update_config", title: "Manager cập nhật cấu hình giờ mở cửa", time: "30 phút trước", icon: Settings, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 4, type: "security", title: "Phát hiện 5 lần đăng nhập sai mật khẩu", time: "1 giờ trước", icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-500/10" },
];

export function AdminSystemActivity() {
  return (
    <Card className="col-span-1 shadow-sm border-white/5 bg-background">
      <CardHeader>
        <CardTitle>Nhật ký hệ thống</CardTitle>
        <CardDescription>
          Hoạt động quản trị gần đây
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-4">
          {SYSTEM_ACTIVITIES.map((activity) => {
            const Icon = activity.icon;
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
