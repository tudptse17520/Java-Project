import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AvailabilityIndicatorProps {
  availableSlots: number;
  className?: string;
}

export function AvailabilityIndicator({ availableSlots, className }: AvailabilityIndicatorProps) {
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
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors",
        isFull
          ? "bg-danger/10 text-danger"
          : "bg-success/10 text-success",
        pulse && !isFull && "bg-success/20 animate-pulse",
        pulse && isFull && "bg-danger/20 animate-pulse",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isFull ? "bg-danger" : "bg-success"
        )}
      />
      {availableSlots} chỗ trống
    </div>
  );
}
