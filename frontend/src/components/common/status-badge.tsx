// ---------------------------------------------
// Status Badge Component
// Component chịu trách nhiệm hiển thị giao diện theo variant
// ---------------------------------------------

import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  type LucideIcon,
} from "lucide-react";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "purple" | "cyan" | "default";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon | null; // Cho phép ẩn icon nếu truyền null
}

const variantConfig: Record<
  BadgeVariant,
  {
    colorClass: string;
    icon: LucideIcon;
  }
> = {
  success: {
    colorClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20",
    icon: CheckCircle2,
  },
  warning: {
    colorClass: "bg-amber-500/15 text-amber-600 dark:text-amber-500 border border-amber-500/20",
    icon: Clock,
  },
  danger: {
    colorClass: "bg-rose-500/15 text-rose-600 dark:text-rose-500 border border-rose-500/20",
    icon: AlertTriangle,
  },
  info: {
    colorClass: "bg-blue-500/15 text-blue-600 dark:text-blue-500 border border-blue-500/20",
    icon: Info,
  },
  purple: {
    colorClass: "bg-purple-500/15 text-purple-600 dark:text-purple-500 border border-purple-500/20",
    icon: Info,
  },
  cyan: {
    colorClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-500 border border-cyan-500/20",
    icon: Info,
  },
  default: {
    colorClass: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20",
    icon: Info,
  }
};

export function StatusBadge({
  variant,
  children,
  className,
  icon,
}: StatusBadgeProps) {
  const config = variantConfig[variant] || variantConfig.info;
  const Icon = icon === undefined ? config.icon : icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 whitespace-nowrap h-6",
        config.colorClass,
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{children}</span>
    </span>
  );
}
