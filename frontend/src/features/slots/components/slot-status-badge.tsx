"use client";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CheckCircle2, XCircle, AlertTriangle, Clock, MapPin } from "lucide-react";
import { useUpdateSlotStatus } from "../hooks/use-slots";
import { toast } from "sonner"; // Assuming sonner is used for toast, if not we'll just skip the toast or use alert

export type SlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'LOCKED';

interface SlotStatusBadgeProps {
  slotId?: number;
  status: string;
  readonly?: boolean;
}

export function getStatusConfig(status: string) {
  switch (status as SlotStatus) {
    case 'AVAILABLE':
      return { label: 'Còn trống', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400', icon: CheckCircle2 };
    case 'OCCUPIED':
      return { label: 'Đang đỗ', className: 'bg-blue-100 text-blue-800 dark:bg-blue-500/30 dark:text-blue-300', icon: MapPin };
    case 'RESERVED':
      return { label: 'Đặt trước', className: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400', icon: Clock };
    case 'MAINTENANCE':
      return { label: 'Bảo trì', className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400', icon: AlertTriangle };
    case 'LOCKED':
      return { label: 'Đã khóa', className: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400', icon: XCircle };
    default:
      return { label: 'Không xác định', className: 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400', icon: CheckCircle2 };
  }
}

export function SlotStatusBadge({ slotId, status, readonly = false }: SlotStatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  const updateMutation = useUpdateSlotStatus();

  const handleStatusChange = (newStatus: SlotStatus) => {
    if (!slotId || newStatus === status) return;
    
    // Show confirmation for dangerous statuses
    if (newStatus === 'MAINTENANCE' || newStatus === 'LOCKED') {
      if (!window.confirm(`Bạn có chắc chắn muốn chuyển sang trạng thái ${getStatusConfig(newStatus).label}?`)) {
        return;
      }
    }

    updateMutation.mutate({ id: slotId, status: newStatus }, {
      onSuccess: () => {
        // Here we could add a toast notification
      }
    });
  };

  const badgeContent = (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors", 
      config.className,
      !readonly && "cursor-pointer hover:brightness-95 dark:hover:brightness-110"
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
      {!readonly && <ChevronDown className="w-3 h-3 opacity-50 ml-1" />}
    </div>
  );

  if (readonly || !slotId) {
    return badgeContent;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        {badgeContent}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuItem onClick={() => handleStatusChange('AVAILABLE')}>Còn trống</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('OCCUPIED')}>Đang đỗ</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('RESERVED')}>Đặt trước</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('MAINTENANCE')}>Bảo trì</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('LOCKED')} className="text-destructive focus:text-destructive">Đã khóa</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
