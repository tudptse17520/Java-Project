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
        "flex flex-col items-center justify-center gap-5 py-24 px-6 rounded-xl border-2 border-dashed border-border/60 bg-slate-50/50 dark:bg-slate-900/20 text-center animate-fade-in",
        className
      )}
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 ring-8 ring-primary/5">
        <Icon className="h-10 w-10 text-primary/40" strokeWidth={1.5} />
      </div>
      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
