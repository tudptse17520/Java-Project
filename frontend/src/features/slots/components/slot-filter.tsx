import React from 'react';
import { useFloors } from '@/features/floors/hooks/use-floors';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SlotFilterProps {
  keyword: string;
  floorId?: number;
  status: string;
  onKeywordChange: (value: string) => void;
  onFloorIdChange: (floorId?: number) => void;
  onStatusChange: (status: string) => void;
}

export function SlotFilter({
  keyword,
  floorId,
  status,
  onKeywordChange,
  onFloorIdChange,
  onStatusChange,
}: SlotFilterProps) {
  const { data: floors = [], isLoading } = useFloors();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full flex-wrap">
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm vị trí (VD: A1-002)..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      <Select value={floorId?.toString() || "all"} onValueChange={(val) => onFloorIdChange(val === "all" || !val ? undefined : Number(val))}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Tất cả tầng">
            {floorId ? floors.find((f: any) => f.id === floorId)?.floorName || "Tất cả tầng" : "Tất cả tầng"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả tầng</SelectItem>
          {!isLoading && floors.map((floor: any) => (
            <SelectItem key={floor.id} value={floor.id.toString()}>
              {floor.floorName} - {floor.buildingName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status || "all"} onValueChange={(val) => onStatusChange(val === "all" || !val ? "" : val)}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Tất cả trạng thái">
            {status === "AVAILABLE" ? "Còn trống" : 
             status === "OCCUPIED" ? "Đang đỗ" : 
             status === "RESERVED" ? "Đã đặt trước" : 
             status === "MAINTENANCE" ? "Bảo trì" : 
             status === "LOCKED" ? "Đã khóa" : 
             "Tất cả trạng thái"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="AVAILABLE">Còn trống</SelectItem>
          <SelectItem value="OCCUPIED">Đang đỗ</SelectItem>
          <SelectItem value="RESERVED">Đã đặt trước</SelectItem>
          <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
          <SelectItem value="LOCKED">Đã khóa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
