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
    colorClass: "bg-success/10 text-success border-success/20 dark:bg-success/20",
    icon: CheckCircle2,
  },
  warning: {
    colorClass: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20",
    icon: Clock,
  },
  danger: {
    colorClass: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20",
    icon: AlertTriangle,
  },
  info: {
    colorClass: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/20",
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
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors shrink-0",
        config.colorClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </span>
  );
}

