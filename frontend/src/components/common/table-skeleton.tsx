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
    <div className={cn("w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm", className)}>
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="flex border-b border-border/60 bg-muted/40 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="flex-1 px-2">
              <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Body Rows Skeleton */}
        <div className="flex flex-col">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex border-b border-border/40 p-4 last:border-0"
              style={{ animationDelay: `${rowIndex * 100}ms` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 px-2">
                  <div 
                    className="h-3.5 rounded-full bg-muted skeleton-stagger"
                    style={{ 
                      width: `${60 + Math.random() * 30}%`,
                      animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` 
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
