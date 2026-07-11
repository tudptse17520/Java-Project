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
      },
      {
        accessorKey: "capacity",
        header: "Sức chứa",
        cell: ({ row }) => {
          const capacity = row.original.capacity;
          const available = row.original.availableSlots;
          return `${available}/${capacity} trống`;
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
                variant="outline"
                size="icon"
                onClick={() => onDelete(floor)}
                title="Xóa"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
