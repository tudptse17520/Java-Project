// ---------------------------------------------
// Pricing Policy Table
// Bảng hiển thị danh sách bảng giá
// ---------------------------------------------

"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { PricingPolicy } from "@/features/pricing-policies/types/pricing-policy.type";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";

interface PricingPolicyTableProps {
  data: PricingPolicy[];
  isLoading: boolean;
  onEdit: (policy: PricingPolicy) => void;
  onDelete: (policy: PricingPolicy) => void;
}


export function PricingPolicyTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: PricingPolicyTableProps) {
  const columns = useMemo<ColumnDef<PricingPolicy>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "vehicle_type_name",
        header: "Loại phương tiện",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.vehicle_type_name || `ID: ${row.original.vehicle_type_id}`}
          </span>
        ),
      },
      {
        accessorKey: "base_price",
        header: "Giá cơ bản",
        cell: ({ row }) => (
          <span className="font-semibold text-primary">
            {formatCurrency(row.original.base_price)}
          </span>
        ),
      },
      {
        accessorKey: "extra_fee_per_hour",
        header: "Phụ thu / giờ",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatCurrency(row.original.extra_fee_per_hour)}
          </span>
        ),
      },
      {
        accessorKey: "effective_date",
        header: "Ngày hiệu lực",
        cell: ({ row }) => (
          <span>{row.original.effective_date.replace(/-/g, "/")}</span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const policy = row.original;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-primary"
                onClick={() => onEdit(policy)}
                title="Cập nhật"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onDelete(policy)}
                title="Xóa"
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
