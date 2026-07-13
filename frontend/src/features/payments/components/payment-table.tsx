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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Payment } from "@/features/payments/types/payment.type";
import { PaymentStatus, PAYMENT_STATUS_LABELS } from "@/constants/payment-status";
import {
  PAYMENT_METHOD_LABELS,
  FEE_TYPE_LABELS,
} from "@/features/payments/constants/payment.constants";
import { cn } from "@/lib/utils";

interface PaymentTableProps {
  data: (Payment & { plate?: string })[];
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
  const columns = useMemo<ColumnDef<Payment & { plate?: string }>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Mã GD",
        cell: ({ row }) => (
          <span className="font-medium text-muted-foreground">#PAY-{row.original.id.toString().padStart(4, '0')}</span>
        ),
      },
      {
        accessorKey: "parkingSessionId",
        header: "Mã Phiên (PS)",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {row.original.parkingSessionId ? `#PS-${row.original.parkingSessionId.toString().padStart(4, '0')}` : "—"}
          </span>
        ),
      },
      {
        accessorKey: "plate",
        header: "Biển số",
        cell: ({ row }) => (
          <span className="font-medium uppercase">{row.original.plate || "—"}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-center">Số tiền</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="font-semibold text-primary">
              {formatVND(row.original.amount)}
            </span>
          </div>
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
        header: () => <div className="text-center">Trạng thái</div>,
        cell: ({ row }) => {
          const status = row.original.status;
          const label =
            PAYMENT_STATUS_LABELS[status as PaymentStatus] || status;
          return (
            <div className="text-center">
              <StatusBadge variant={getStatusVariant(status)}>
                {label}
              </StatusBadge>
            </div>
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
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onViewDetail(payment)}
                  />
                }>
                  <Eye className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>Xem chi tiết</TooltipContent>
              </Tooltip>

              {isPending && (
                <>
                  <Tooltip>
                    <TooltipTrigger render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onManualStatus(payment)}
                      />
                    }>
                      <Settings2 className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>Cập nhật trạng thái</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onCancel(payment)}
                      />
                    }>
                      <XCircle className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>Hủy giao dịch</TooltipContent>
                  </Tooltip>
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
