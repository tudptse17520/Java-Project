import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="mt-4 flex gap-2 sm:mt-0">{actions}</div>}
      </div>
    </div>
  );
}
