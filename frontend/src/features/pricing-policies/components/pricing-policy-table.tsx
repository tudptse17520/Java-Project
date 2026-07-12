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
import { Edit2, Trash2, Eye } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { Badge } from "@/components/ui/badge";

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
        accessorKey: "vehicleTypeName",
        header: "Loại phương tiện",
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.vehicleTypeName || "Không xác định"}
          </span>
        ),
      },
      {
        accessorKey: "basePrice",
        header: "Giá cơ bản",
        cell: ({ row }) => (
          <span className="tabular-nums font-medium text-foreground/90">
            {formatCurrency(row.original.basePrice)}
          </span>
        ),
      },
      {
        accessorKey: "extraFeePerHour",
        header: "Phụ thu / giờ",
        cell: ({ row }) => (
          <span className="tabular-nums font-medium text-muted-foreground">
            {formatCurrency(row.original.extraFeePerHour)}
          </span>
        ),
      },
      {
        accessorKey: "effectiveDate",
        header: "Hiệu lực",
        cell: ({ row }) => {
          const fromDate = row.original.effectiveDate ? row.original.effectiveDate.replace(/-/g, "/") : "N/A";
          // Giả lập endDate nếu API chưa trả về
          const toDate = "Không thời hạn"; 
          
          return (
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="text-muted-foreground">Từ: <span className="font-medium text-foreground">{fromDate}</span></span>
              <span className="text-muted-foreground">Đến: <span className="font-medium text-foreground">{toDate}</span></span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.original.status || 'ACTIVE';
          let label = "Đang áp dụng";
          let variant: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" = "success";
          
          switch(status) {
            case 'ACTIVE':
              label = "Đang áp dụng";
              variant = "success";
              break;
            case 'EXPIRED':
              label = "Đã hết hiệu lực";
              variant = "secondary";
              break;
            case 'PENDING':
              label = "Sắp áp dụng";
              variant = "warning";
              break;
            case 'SUSPENDED':
              label = "Tạm dừng";
              variant = "destructive";
              break;
          }

          return (
            <Badge variant={variant === "success" ? "default" : variant as any} 
              className={variant === "success" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : 
                         variant === "warning" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20" : ""}
            >
              {label}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Thao tác</div>,
        cell: ({ row }) => {
          const policy = row.original;

          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                title="Chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
                onClick={() => onEdit(policy)}
                title="Sửa"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
