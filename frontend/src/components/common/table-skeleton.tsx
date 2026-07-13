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
    <div className={cn("w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 shadow-sm", className)}>
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="flex border-b border-border/50 bg-[#1C2433] dark:bg-slate-800/80 p-4 h-[53px] items-center">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="flex-1 px-4">
              <div className="h-4 w-24 rounded-md bg-white/10 dark:bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Body Rows Skeleton */}
        <div className="flex flex-col bg-background">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex border-b border-border/10 p-4 h-[60px] items-center last:border-0"
              style={{ animationDelay: `${rowIndex * 100}ms` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 px-4">
                  <div 
                    className="h-4 rounded-md bg-muted/60 dark:bg-muted/30 relative overflow-hidden"
                    style={{ 
                      width: `${40 + Math.random() * 40}%`,
                    }}
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" style={{ animationDelay: `${colIndex * 150}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
