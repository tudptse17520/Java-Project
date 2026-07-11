import React from 'react';
import { useFloors } from '@/features/floors/hooks/use-floors';

interface SlotFilterProps {
  floorId?: number;
  status: string;
  onFloorIdChange: (floorId?: number) => void;
  onStatusChange: (status: string) => void;
}

export function SlotFilter({
  floorId,
  status,
  onFloorIdChange,
  onStatusChange,
}: SlotFilterProps) {
  const { data: floors = [], isLoading } = useFloors();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <select
        value={floorId || ''}
        onChange={(e) => onFloorIdChange(e.target.value ? Number(e.target.value) : undefined)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-64"
        disabled={isLoading}
      >
        <option value="">Tất cả tầng</option>
        {floors.map((floor) => (
          <option key={floor.id} value={floor.id}>
            {floor.floorName} - {floor.buildingName}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-48"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="AVAILABLE">Còn trống</option>
        <option value="OCCUPIED">Đang đỗ</option>
        <option value="RESERVED">Đã đặt trước</option>
        <option value="MAINTENANCE">Bảo trì</option>
        <option value="LOCKED">Đã khóa</option>
      </select>
    </div>
  );
}
