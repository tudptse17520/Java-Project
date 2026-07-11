import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 6,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-md border border-border", className)}>
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="flex border-b border-border bg-muted/50 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="flex-1 px-2">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Body Rows Skeleton */}
        <div className="flex flex-col">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex border-b border-border p-4 last:border-0"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 px-2">
                  <div className="h-4 w-full max-w-[80%] rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
