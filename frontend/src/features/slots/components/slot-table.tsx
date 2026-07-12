/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { SlotStatusBadge } from "./slot-status-badge";
import { ParkingSlot } from "../types/slot.type";
import { useUpdateSlotStatus } from "../hooks/use-slots";

interface SlotTableProps {
  data: ParkingSlot[];
  isLoading?: boolean;
}

export function SlotTable({ data, isLoading }: SlotTableProps) {
  const updateMutation = useUpdateSlotStatus();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateMutation.mutate({ id, status: newStatus });
  };

  const columns = useMemo<ColumnDef<ParkingSlot>[]>(
    () => [
      {
        accessorKey: "slotName",
        header: "Tên vị trí",
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <SlotStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Cập nhật trạng thái",
        cell: ({ row }) => {
          const slot = row.original;
          return (
            <select
              value={slot.status}
              onChange={(e) => handleStatusChange(slot.id, e.target.value)}
              className="h-8 w-36 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              disabled={updateMutation.isPending}
            >
              <option value="AVAILABLE">Còn trống</option>
              <option value="OCCUPIED">Đang đỗ</option>
              <option value="RESERVED">Đã đặt trước</option>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          );
        },
      },
    ],
    [updateMutation]
  );

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
