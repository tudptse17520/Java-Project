import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AvailabilityIndicatorProps {
  availableSlots: number;
  totalSlots?: number;
  className?: string;
}

export function AvailabilityIndicator({ availableSlots, totalSlots, className }: AvailabilityIndicatorProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 1000); // Pulse for 1s
    return () => clearTimeout(timer);
  }, [availableSlots]);

  const isFull = availableSlots === 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
        isFull
          ? "bg-danger/10 text-danger"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        pulse && !isFull && "bg-emerald-500/20 animate-pulse",
        pulse && isFull && "bg-danger/20 animate-pulse",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isFull ? "bg-danger animate-pulse" : "bg-emerald-500"
        )}
      />
      {totalSlots ? `${availableSlots} / ${totalSlots} chỗ` : `${availableSlots} chỗ trống`}
    </div>
  );
}
