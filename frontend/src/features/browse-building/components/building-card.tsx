import React, { memo } from "react";
import { MapPin, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { BuildingStatus } from "@/constants/building-status";
import type { BuildingBrowseItem } from "../types/browse-building.type";
import { BuildingStatusBadge } from "./building-status-badge";
import { AvailabilityIndicator } from "./availability-indicator";

interface BuildingCardProps {
  building: BuildingBrowseItem;
  onClick?: (id: number) => void;
}

export const BuildingCard = memo(function BuildingCard({ building, onClick }: BuildingCardProps) {
  const isInactive = building.status !== BuildingStatus.ACTIVE;

  return (
    <div
      onClick={() => onClick?.(building.id)}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        isInactive && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none tracking-tight text-lg group-hover:text-primary transition-colors">
              {building.building_name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground pt-1">
              <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{building.address}</span>
            </div>
          </div>
          <BuildingStatusBadge status={building.status} />
        </div>

        <div className="flex items-center gap-4 text-sm mt-2">
          <div className="flex items-center text-muted-foreground">
            <Layers className="mr-1.5 h-4 w-4" />
            <span>{building.number_of_floors} tầng</span>
          </div>
          <div className="ml-auto">
            <AvailabilityIndicator availableSlots={building.available_slots} />
          </div>
        </div>
      </div>
    </div>
  );
});
