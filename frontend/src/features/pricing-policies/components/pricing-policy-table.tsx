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
        cell: ({ row }) => (
          <span className="text-muted-foreground/70 font-mono text-xs font-semibold">
            #{row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "vehicle_type_name",
        header: "Loại phương tiện",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 shadow-sm transition-all hover:bg-primary/20">
              {row.original.vehicle_type_name || `ID: ${row.original.vehicle_type_id}`}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "base_price",
        header: "Giá cơ bản",
        cell: ({ row }) => (
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 drop-shadow-sm">
            {formatCurrency(row.original.base_price)}
          </span>
        ),
      },
      {
        accessorKey: "extra_fee_per_hour",
        header: "Phụ thu / giờ",
        cell: ({ row }) => (
          <span className="font-medium text-amber-600/90 bg-amber-50 px-2 py-1 rounded-md border border-amber-100/50">
            {formatCurrency(row.original.extra_fee_per_hour)}
          </span>
        ),
      },
      {
        accessorKey: "effective_date",
        header: "Ngày hiệu lực",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
            {row.original.effective_date.replace(/-/g, "/")}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${row.original.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {row.original.status === 'ACTIVE' ? 'Đang áp dụng' : 'Không áp dụng'}
          </span>
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
                className="h-8 w-8 p-0 text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 transition-all duration-300 shadow-sm"
                onClick={() => onEdit(policy)}
                title="Cập nhật"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 border-red-200 bg-red-50/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm hover:scale-105"
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

  return <DataTable columns={columns} data={data} isLoading={isLoading} pageSize={50} />;
}
