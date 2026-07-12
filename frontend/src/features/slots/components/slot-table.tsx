/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { SlotStatusBadge } from "./slot-status-badge";
import { ParkingSlot } from "../types/slot.type";
import { Pencil, Trash2, Eye } from "lucide-react";

interface SlotTableProps {
  data: ParkingSlot[];
  isLoading?: boolean;
}

export function SlotTable({ data, isLoading }: SlotTableProps) {
  const columns = useMemo<ColumnDef<ParkingSlot>[]>(
    () => [
      {
        accessorKey: "slotName",
        header: "Tên vị trí",
        cell: ({ row }) => <span className="font-semibold">{row.original.slotName}</span>,
      },
      {
        accessorKey: "floorName",
        header: "Tầng",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.floorName || "Hầm B1"}
          </span>
        ),
      },
      {
        accessorKey: "vehicleTypeName",
        header: "Loại xe",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.vehicleTypeName || "Ô tô"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <SlotStatusBadge slotId={row.original.id} status={row.original.status} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Thao tác</div>,
        cell: ({ row }) => {
          const slot = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                title="Chi tiết"
                className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Sửa"
                className="h-8 w-8 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
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
    []
  );

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
