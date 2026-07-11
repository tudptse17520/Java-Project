import React from 'react';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-md border", className)}>
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex gap-4">
            <div className="h-4 w-1/12 rounded bg-muted"></div>
            <div className="h-4 w-3/12 rounded bg-muted"></div>
            <div className="h-4 w-4/12 rounded bg-muted"></div>
            <div className="h-4 w-2/12 rounded bg-muted"></div>
            <div className="h-4 w-2/12 rounded bg-muted"></div>
          </div>
        </div>
        
        {/* Rows Skeleton */}
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex gap-4 px-4 py-4">
              <div className="h-4 w-1/12 rounded bg-muted"></div>
              <div className="h-4 w-3/12 rounded bg-muted"></div>
              <div className="h-4 w-4/12 rounded bg-muted"></div>
              <div className="h-4 w-2/12 rounded bg-muted"></div>
              <div className="h-4 w-2/12 rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
