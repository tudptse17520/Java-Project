"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { VehicleType } from "@/features/vehicle-types/types/vehicle-type.type";
import {
  VehicleTypeStatus,
  VEHICLE_TYPE_STATUS_LABELS,
} from "@/constants/vehicle-type-status";
import { Button } from "@/components/ui/button";
import { Edit2, ShieldBan } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleTypeTableProps {
  data: VehicleType[];
  isLoading: boolean;
  onEdit: (vehicleType: VehicleType) => void;
  onDeactivate: (vehicleType: VehicleType) => void;
}

export function VehicleTypeTable({
  data,
  isLoading,
  onEdit,
  onDeactivate,
}: VehicleTypeTableProps) {
  const columns = useMemo<ColumnDef<VehicleType>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "typeName",
        header: "Tên loại",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.typeName}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => {
          const desc = row.original.description;
          return (
            <span className="text-muted-foreground">
              {desc ? desc : <span className="italic">Không có mô tả</span>}
            </span>
          );
        },
      },
      {
        accessorKey: "activeSessionsCount",
        header: "Đang đỗ (xe)",
        cell: ({ row }) => {
          const count = row.original.activeSessionsCount || 0;
          return (
            <span className={cn("font-medium", count > 0 ? "text-blue-500" : "text-muted-foreground")}>
              {count}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.original.status;
          const isActive = status === VehicleTypeStatus.ACTIVE;
          return (
            <StatusBadge variant={isActive ? "success" : "danger"}>
              {VEHICLE_TYPE_STATUS_LABELS[status]}
            </StatusBadge>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const vehicleType = row.original;
          const isActive = vehicleType.status === VehicleTypeStatus.ACTIVE;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-primary"
                onClick={() => onEdit(vehicleType)}
                title="Cập nhật"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              {isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onDeactivate(vehicleType)}
                  title="Ngừng áp dụng"
                >
                  <ShieldBan className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onEdit, onDeactivate]
  );

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
