// ---------------------------------------------
// Empty State
// Hiển thị khi không có dữ liệu
// ---------------------------------------------

import { cn } from "@/lib/utils";
import { Inbox, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "Không có dữ liệu",
  description = "Chưa có dữ liệu nào được tìm thấy.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
        <Icon className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <div className="text-center max-w-sm">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
