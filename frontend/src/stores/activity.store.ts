import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserPlus, UserMinus, Settings, ShieldAlert, LucideIcon, Edit } from "lucide-react";

export type ActivityType = "create_user" | "block_user" | "update_config" | "security" | "update_user";

export interface SystemActivity {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: number;
  icon: string;
  color: string;
  bg: string;
}

interface ActivityState {
  activities: SystemActivity[];
  addActivity: (activity: Omit<SystemActivity, "id" | "timestamp">) => void;
}

const initialActivities: SystemActivity[] = [
  { id: "1", type: "create_user", title: "Manager Nguyễn Văn A tạo tài khoản Staff", timestamp: Date.now() - 10 * 60 * 1000, icon: "UserPlus", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "2", type: "block_user", title: "Tài khoản user_01 bị khóa", timestamp: Date.now() - 20 * 60 * 1000, icon: "UserMinus", color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "3", type: "update_config", title: "Manager cập nhật cấu hình giờ mở cửa", timestamp: Date.now() - 30 * 60 * 1000, icon: "Settings", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "4", type: "security", title: "Phát hiện 5 lần đăng nhập sai mật khẩu", timestamp: Date.now() - 60 * 60 * 1000, icon: "ShieldAlert", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: initialActivities,
      addActivity: (activity) =>
        set((state) => {
          const newActivity: SystemActivity = {
            ...activity,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
          };
          return { activities: [newActivity, ...state.activities].slice(0, 20) };
        }),
    }),
    {
      name: "system-activity-log",
    }
  )
);
