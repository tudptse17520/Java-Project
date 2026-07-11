import { cn } from "@/lib/utils";

type SlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'LOCKED';

interface SlotStatusBadgeProps {
  status: string;
}

export function SlotStatusBadge({ status }: SlotStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status as SlotStatus) {
      case 'AVAILABLE':
        return { label: 'Còn trống', className: 'bg-green-100 text-green-800' };
      case 'OCCUPIED':
        return { label: 'Đang đỗ', className: 'bg-blue-100 text-blue-800' };
      case 'RESERVED':
        return { label: 'Đã đặt trước', className: 'bg-purple-100 text-purple-800' };
      case 'MAINTENANCE':
        return { label: 'Bảo trì', className: 'bg-yellow-100 text-yellow-800' };
      case 'LOCKED':
        return { label: 'Đã khóa', className: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Không xác định', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
