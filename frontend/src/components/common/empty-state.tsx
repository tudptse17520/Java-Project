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
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
    >
      <Icon className="h-12 w-12 text-muted-foreground/50" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
