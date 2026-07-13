import React, { memo } from "react";
import { MapPin, Layers, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BuildingStatus } from "@/constants/building-status";
import type { BuildingBrowseItem } from "../types/browse-building.type";
import { BuildingStatusBadge } from "./building-status-badge";
import { AvailabilityIndicator } from "./availability-indicator";
import { Button } from "@/components/ui/button";

interface BuildingCardProps {
  building: BuildingBrowseItem;
  onClick?: (id: number) => void;
}

export const BuildingCard = memo(function BuildingCard({ building, onClick }: BuildingCardProps) {
  const isInactive = building.status !== BuildingStatus.ACTIVE;

  // Mock total slots for UI presentation. Will be updated when backend supports it.
  const mockTotalSlots = building.availableSlots + 45;

  return (
    <div
      onClick={() => onClick?.(building.id)}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20",
        isInactive && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex flex-col p-5 h-full">
        {/* Header: Title and Status */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 className="font-bold text-[1.15rem] leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
            {building.buildingName}
          </h3>
          <BuildingStatusBadge status={building.status} className="shrink-0" />
        </div>

        {/* Address */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span className="line-clamp-1">{building.address}</span>
        </div>

        {/* Vehicle Types (Mocked) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 mb-4">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            <span>🚗 Ô tô</span>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            <span>🏍 Xe máy</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border/40 my-2" />

        {/* Bottom Info: Slots, Time, CTA */}
        <div className="grid grid-cols-2 gap-y-3 text-sm my-4">
          <div className="flex items-center text-muted-foreground">
            <Layers className="mr-2 h-4 w-4 text-muted-foreground/70" />
            <span>{building.numberOfFloors} tầng</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground/70" />
            <span>6:00 - 23:00</span>
          </div>
          <div className="col-span-2 mt-1">
            <AvailabilityIndicator availableSlots={building.availableSlots} totalSlots={mockTotalSlots} />
          </div>
        </div>

        {/* Spacer to push CTA to bottom if cards are different heights */}
        <div className="flex-grow" />

        {/* CTA Button */}
        <div className="mt-2 pt-2">
          <Button 
            variant="default" 
            className="w-full font-semibold shadow-sm rounded-xl group-hover:shadow group-hover:bg-primary/90 transition-all h-10"
          >
            Xem chi tiết
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
