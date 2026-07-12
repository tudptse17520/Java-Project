// ---------------------------------------------
// Status Badge Component
// Component chỉ chịu trách nhiệm hiển thị giao diện theo variant
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

export type BadgeVariant = "success" | "warning" | "danger" | "info";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}

const variantConfig: Record<
  BadgeVariant,
  {
    colorClass: string;
    icon: LucideIcon;
  }
> = {
  success: {
    colorClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15",
    icon: CheckCircle2,
  },
  warning: {
    colorClass: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15",
    icon: Clock,
  },
  danger: {
    colorClass: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 dark:bg-rose-500/15",
    icon: AlertTriangle,
  },
  info: {
    colorClass: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/15",
    icon: Info,
  },
};

export function StatusBadge({
  variant,
  children,
  className,
  icon,
}: StatusBadgeProps) {
  const config = variantConfig[variant] || variantConfig.info;
  const Icon = icon || config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors shrink-0",
        config.colorClass,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{children}</span>
    </span>
  );
}
