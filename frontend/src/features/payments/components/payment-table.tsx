// ---------------------------------------------
// Payment Table
// Bảng hiển thị danh sách giao dịch thanh toán
// ---------------------------------------------

"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Settings2, XCircle } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import type { Payment } from "@/features/payments/types/payment.type";
import { PaymentStatus, PAYMENT_STATUS_LABELS } from "@/constants/payment-status";
import {
  PAYMENT_METHOD_LABELS,
  FEE_TYPE_LABELS,
} from "@/features/payments/constants/payment.constants";
import { cn } from "@/lib/utils";

interface PaymentTableProps {
  data: Payment[];
  isLoading: boolean;
  onViewDetail: (payment: Payment) => void;
  onManualStatus: (payment: Payment) => void;
  onCancel: (payment: Payment) => void;
}

/**
 * Format số tiền sang VND
 */
function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Màu sắc cho status badge
 */
function getStatusVariant(status: string): "success" | "warning" | "danger" | "info" {
  switch (status) {
    case PaymentStatus.SUCCESS:
      return "success";
    case PaymentStatus.PENDING:
      return "warning";
    case PaymentStatus.FAILED:
      return "danger";
    default:
      return "info";
  }
}


export function PaymentTable({
  data,
  isLoading,
  onViewDetail,
  onManualStatus,
  onCancel,
}: PaymentTableProps) {
  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-medium">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Số tiền",
        cell: ({ row }) => (
          <span className="font-semibold text-primary">
            {formatVND(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Phương thức",
        cell: ({ row }) =>
          PAYMENT_METHOD_LABELS[row.original.paymentMethod] ||
          row.original.paymentMethod,
      },
      {
        accessorKey: "feeType",
        header: "Loại phí",
        cell: ({ row }) =>
          FEE_TYPE_LABELS[row.original.feeType] || row.original.feeType,
      },
      {
        accessorKey: "paymentTime",
        header: "Thời gian",
        cell: ({ row }) => row.original.paymentTime || "—",
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.original.status;
          const label =
            PAYMENT_STATUS_LABELS[status as PaymentStatus] || status;
          return (
            <StatusBadge variant={getStatusVariant(status)}>
              {label}
            </StatusBadge>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const payment = row.original;
          const isPending = payment.status === PaymentStatus.PENDING;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onViewDetail(payment)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {isPending && (
                <>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onManualStatus(payment)}
                    title="Cập nhật trạng thái"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onCancel(payment)}
                    title="Hủy giao dịch"
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [onViewDetail, onManualStatus, onCancel]
  );

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
