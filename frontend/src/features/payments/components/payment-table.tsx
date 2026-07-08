// ---------------------------------------------
// Payment Table
// Bảng hiển thị danh sách giao dịch thanh toán
// ---------------------------------------------

"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Settings2, XCircle } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
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
function getStatusColor(status: string): string {
  switch (status) {
    case PaymentStatus.SUCCESS:
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case PaymentStatus.FAILED:
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600";
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
        accessorKey: "payment_method",
        header: "Phương thức",
        cell: ({ row }) =>
          PAYMENT_METHOD_LABELS[row.original.payment_method] ||
          row.original.payment_method,
      },
      {
        accessorKey: "fee_type",
        header: "Loại phí",
        cell: ({ row }) =>
          FEE_TYPE_LABELS[row.original.fee_type] || row.original.fee_type,
      },
      {
        accessorKey: "payment_time",
        header: "Thời gian",
        cell: ({ row }) => row.original.payment_time || "—",
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.original.status;
          const label =
            PAYMENT_STATUS_LABELS[status as PaymentStatus] || status;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                getStatusColor(status)
              )}
            >
              {label}
            </span>
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
