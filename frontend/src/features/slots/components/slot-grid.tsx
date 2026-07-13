"use client";

import { ParkingSlot } from "../types/slot.type";
import { getStatusConfig, SlotStatus } from "./slot-status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateSlotStatus } from "../hooks/use-slots";
import { cn } from "@/lib/utils";

interface SlotGridProps {
  data: ParkingSlot[];
  isLoading?: boolean;
}

export function SlotGrid({ data, isLoading }: SlotGridProps) {
  const updateMutation = useUpdateSlotStatus();

  const handleStatusChange = (id: number, currentStatus: string, newStatus: SlotStatus, slotName: string) => {
    if (newStatus === currentStatus) return;
    
    if (newStatus === 'MAINTENANCE' || newStatus === 'LOCKED') {
      if (!window.confirm(`Bạn có chắc chắn muốn chuyển sang trạng thái ${getStatusConfig(newStatus).label}?`)) {
        return;
      }
    }
    updateMutation.mutate({ id, status: newStatus, slotName });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 mt-6">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 mt-6 border rounded-md border-dashed">
        <p className="text-muted-foreground">Không có vị trí đỗ nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 mt-6">
      {data.map((slot) => {
        const config = getStatusConfig(slot.status);
        const Icon = config.icon;
        
        return (
          <DropdownMenu key={slot.id}>
            <DropdownMenuTrigger className="focus:outline-none">
              <div 
                className={cn(
                  "relative group flex flex-col items-center justify-center aspect-square rounded-md border transition-all hover:shadow-md cursor-pointer",
                  slot.status === 'AVAILABLE' ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" :
                  slot.status === 'OCCUPIED' ? "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20" :
                  slot.status === 'RESERVED' ? "bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/20" :
                  slot.status === 'MAINTENANCE' ? "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20" :
                  "bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20"
                )}
                title={`${slot.slotName} - ${config.label}${slot.status === 'OCCUPIED' ? ' | Biển số: 51F-123.45' : ''}`}
              >
                <Icon className={cn(
                  "w-6 h-6 mb-1",
                  slot.status === 'AVAILABLE' ? "text-emerald-500" :
                  slot.status === 'OCCUPIED' ? "text-blue-500" :
                  slot.status === 'RESERVED' ? "text-purple-500" :
                  slot.status === 'MAINTENANCE' ? "text-amber-500" :
                  "text-rose-500"
                )} />
                <span className="text-xs font-semibold tracking-tight text-foreground truncate w-full px-1 text-center">
                  {slot.slotName}
                </span>
                
                {/* Visual strike-through for LOCKED or MAINTENANCE */}
                {(slot.status === 'LOCKED' || slot.status === 'MAINTENANCE') && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <div className="w-full h-1 bg-foreground -rotate-45" />
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => handleStatusChange(slot.id, slot.status, 'AVAILABLE', slot.slotName)}>Còn trống</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(slot.id, slot.status, 'OCCUPIED', slot.slotName)}>Đang đỗ</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(slot.id, slot.status, 'RESERVED', slot.slotName)}>Đặt trước</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(slot.id, slot.status, 'MAINTENANCE', slot.slotName)}>Bảo trì</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(slot.id, slot.status, 'LOCKED', slot.slotName)} className="text-destructive focus:text-destructive">Đã khóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}
