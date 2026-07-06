// ---------------------------------------------
// Status Badge Component
// Trình ánh xạ trạng thái miền dữ liệu toàn cục với icons & colors chuẩn hóa
// ---------------------------------------------

import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Lock,
  AlertTriangle,
  HelpCircle,
  XCircle,
  EyeOff,
  CircleDot,
} from "lucide-react";

export type SystemStatus =
  // Buildings / Floors / Slots / Vehicle Types
  | "ACTIVE"
  | "MAINTENANCE"
  | "INACTIVE"
  | "LOCKED"
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  // Bookings / Sessions / Payments / Feedbacks
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CANCELLED"
  | "EXPIRED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SUCCESS"
  | "FAILED"
  | "REPORTED"
  | "PROCESSING"
  | "RESOLVED";

interface StatusBadgeProps {
  status: SystemStatus | string;
  label?: string;
  className?: string;
}

const statusConfig: Record<
  string,
  {
    colorClass: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }
> = {
  // SUCCESS / ACTIVE states -> success green
  AVAILABLE: {
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CheckCircle2,
    label: "Còn trống",
  },
  ACTIVE: {
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CheckCircle2,
    label: "Hoạt động",
  },
  SUCCESS: {
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CheckCircle2,
    label: "Thành công",
  },
  CONFIRMED: {
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CheckCircle2,
    label: "Đã xác nhận",
  },
  CHECKED_IN: {
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CircleDot,
    label: "Đã check-in",
  },
  COMPLETED: {
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CheckCircle2,
    label: "Hoàn tất",
  },
  RESOLVED: {
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CheckCircle2,
    label: "Đã giải quyết",
  },

  // WARNING / PENDING states -> warning yellow
  RESERVED: {
    colorClass: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20",
    icon: Clock,
    label: "Đã đặt trước",
  },
  PENDING: {
    colorClass: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20",
    icon: Clock,
    label: "Chờ thanh toán",
  },
  PROCESSING: {
    colorClass: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20",
    icon: Clock,
    label: "Đang xử lý",
  },
  IN_PROGRESS: {
    colorClass: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20",
    icon: Clock,
    label: "Đang gửi xe",
  },
  REPORTED: {
    colorClass: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20",
    icon: Clock,
    label: "Đã báo cáo",
  },

  // DANGER / INACTIVE / FAILED states -> danger red
  OCCUPIED: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: Lock,
    label: "Có xe đỗ",
  },
  MAINTENANCE: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: AlertTriangle,
    label: "Bảo trì",
  },
  LOCKED: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: Lock,
    label: "Tạm khóa",
  },
  INACTIVE: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: EyeOff,
    label: "Ngưng hoạt động",
  },
  FAILED: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: XCircle,
    label: "Thất bại",
  },
  CANCELLED: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: XCircle,
    label: "Đã hủy",
  },
  EXPIRED: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: AlertTriangle,
    label: "Hết hạn",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const cleanStatus = status ? status.toUpperCase() : "";
  const config = statusConfig[cleanStatus] || {
    colorClass: "bg-muted text-muted-foreground border-border",
    icon: HelpCircle,
    label: status || "N/A",
  };

  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors shrink-0",
        config.colorClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{displayLabel}</span>
    </span>
  );
}
