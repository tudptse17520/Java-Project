"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Floor } from "../types/floor.type";
import { FloorStatusBadge } from "./floor-status-badge";

interface FloorTableProps {
  data: Floor[];
  isLoading?: boolean;
  onEdit: (floor: Floor) => void;
  onDelete: (floor: Floor) => void;
}

export function FloorTable({ data, isLoading, onEdit, onDelete }: FloorTableProps) {
  const columns = useMemo<ColumnDef<Floor>[]>(
    () => [
      {
        accessorKey: "floorName",
        header: "Tên tầng",
      },
      {
        accessorKey: "floorLevel",
        header: "Cấp độ",
        cell: ({ row }) => {
          const level = row.original.floorLevel;
          if (level < 0) return `Hầm B${Math.abs(level)}`;
          if (level > 0) return `Tầng ${level}`;
          return "Trệt";
        }
      },
      {
        accessorKey: "capacity",
        header: "Sức chứa",
        cell: ({ row }) => {
          const capacity = row.original.capacity;
          const available = row.original.availableSlots;
          const occupied = capacity - available;
          const percent = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
          return (
            <div className="flex flex-col gap-1.5 min-w-[140px]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">Đã lấp đầy: {occupied}/{capacity}</span>
                <span className="text-muted-foreground">{percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${percent > 90 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${percent}%` }} 
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "buildingName",
        header: "Tòa nhà",
      },
      {
        accessorKey: "vehicleTypeName",
        header: "Loại xe",
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <FloorStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const floor = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(floor)}
                title="Sửa"
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(floor)}
                title="Xóa"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
