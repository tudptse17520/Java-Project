import React, { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuildingDetail } from "../hooks/use-building-detail";
import { useSlotAvailabilityStream } from "../hooks/use-slot-availability-stream";
import { BuildingStatusBadge } from "./building-status-badge";
import { FloorAvailabilityRow } from "./floor-availability-row";
import { AvailabilityIndicator } from "./availability-indicator";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useQueryClient } from "@tanstack/react-query";
import { BROWSE_BUILDING_KEYS } from "../constants/browse-building.constants";
import type { BuildingDetail } from "../types/browse-building.type";
import { Portal } from "@/components/common/portal";

interface BuildingDetailDialogProps {
  buildingId: number | null;
  onClose: () => void;
}

export function BuildingDetailDialog({ buildingId, onClose }: BuildingDetailDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: building, isLoading, error } = useBuildingDetail(buildingId);

  // Subscribe to building-specific SSE
  useSlotAvailabilityStream({
    buildingId,
    onEvent: (event) => {
      // Optimitiscally update the query cache without refetching
      if (!buildingId) return;
      queryClient.setQueryData<BuildingDetail>(
        BROWSE_BUILDING_KEYS.detail(buildingId),
        (oldData) => {
          if (!oldData) return oldData;

          // Update building total
          const newTotal = event.building_available_slots;
          
          // Update specific floor
          const newFloors = oldData.floors.map(f => {
            if (f.id === event.floor_id) {
              return { ...f, available_slots: event.available_slots };
            }
            return f;
          });

          return {
            ...oldData,
            total_available_slots: newTotal,
            floors: newFloors
          };
        }
      );
    }
  });

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (buildingId !== null) {
      document.addEventListener("keydown", handleKeyDown);
      // Small delay for entrance animation
      requestAnimationFrame(() => setIsVisible(true));
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [buildingId]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (buildingId === null) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Dialog content */}
      <div 
        className={cn(
          "relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border bg-background shadow-lg transition-all duration-200 ease-out",
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Chi tiết bãi đỗ xe
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Đang tải dữ liệu tòa nhà..." />
            </div>
          ) : error || !building ? (
            <div className="py-12 text-center text-danger">
              <p>Đã xảy ra lỗi khi tải dữ liệu.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Building Info */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold">{building.building_name}</h3>
                  <BuildingStatusBadge status={building.status} />
                </div>
                
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="mr-1.5 h-4 w-4" />
                  <span>{building.address}</span>
                </div>

                <div className="mt-2 flex items-center p-4 bg-muted/50 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Tổng số chỗ trống</p>
                    <p className="text-3xl font-bold mt-1">{building.total_available_slots}</p>
                  </div>
                  <div>
                    <AvailabilityIndicator availableSlots={building.total_available_slots} className="text-lg px-3 py-1.5" />
                  </div>
                </div>
              </div>

              {/* Floors */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Sơ đồ tầng ({building.floors.length})
                </h4>
                {building.floors.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có cấu hình tầng cho tòa nhà này.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {building.floors.map((floor) => (
                      <FloorAvailabilityRow key={floor.id} floor={floor} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}

