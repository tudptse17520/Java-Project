import React, { memo } from "react";
import { Car } from "lucide-react";
import type { FloorDetail } from "../types/browse-building.type";
import { FloorStatusBadge } from "./floor-status-badge";
import { AvailabilityIndicator } from "./availability-indicator";

interface FloorAvailabilityRowProps {
  floor: FloorDetail;
}

export const FloorAvailabilityRow = memo(function FloorAvailabilityRow({ floor }: FloorAvailabilityRowProps) {
  // Calculate percentage for progress bar, handle divide by zero
  const capacity = floor.capacity > 0 ? floor.capacity : 1;
  const occupied = capacity - (floor.availableSlots || 0);
  const percentage = Math.min(Math.max((occupied / capacity) * 100, 0), 100);
  
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-base">{floor.floorName}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Tầng {floor.floorLevel}
          </span>
        </div>
        <FloorStatusBadge status={floor.status} />
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center text-sm text-muted-foreground">
          <Car className="mr-1.5 h-4 w-4" />
          <span>{floor.vehicleTypeName || "Mọi loại xe"}</span>
        </div>
        <AvailabilityIndicator availableSlots={floor.availableSlots || 0} />
      </div>

      {/* Visual progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary mt-1">
        <div
          className="h-full transition-all duration-500 ease-in-out bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Đã dùng: {occupied}</span>
        <span>Tổng sức chứa: {floor.capacity}</span>
      </div>
    </div>
  );
});
