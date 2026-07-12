// ---------------------------------------------
// Payment Detail Dialog
// Dialog hiển thị chi tiết biên lai thanh toán (Read-only)
// ---------------------------------------------

"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import type { Payment } from "@/features/payments/types/payment.type";
import { PaymentStatus, PAYMENT_STATUS_LABELS } from "@/constants/payment-status";
import {
  PAYMENT_METHOD_LABELS,
  FEE_TYPE_LABELS,
} from "@/features/payments/constants/payment.constants";
import { cn } from "@/lib/utils";

interface PaymentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
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


export function PaymentDetailDialog({
  open,
  onClose,
  payment,
}: PaymentDetailDialogProps) {
  if (!open || !payment) return null;

  const statusLabel =
    PAYMENT_STATUS_LABELS[payment.status as PaymentStatus] || payment.status;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Chi tiết biên lai</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Thông tin giao dịch #{payment.id}
        </p>

        <div className="mt-4 space-y-3">
          <DetailRow label="Mã giao dịch" value={`#${payment.id}`} />
          <DetailRow
            label="Mã lượt gửi xe"
            value={
              payment.parkingSessionId != null
                ? `#${payment.parkingSessionId}`
                : "—"
            }
          />
          <DetailRow
            label="Mã đặt chỗ"
            value={
              payment.bookingId != null ? `#${payment.bookingId}` : "—"
            }
          />
          <DetailRow
            label="Số tiền"
            value={formatVND(payment.amount)}
            className="font-semibold text-primary"
          />
          <DetailRow
            label="Phương thức"
            value={
              PAYMENT_METHOD_LABELS[payment.paymentMethod] ||
              payment.paymentMethod
            }
          />
          <DetailRow
            label="Loại phí"
            value={
              FEE_TYPE_LABELS[payment.feeType] || payment.feeType
            }
          />
          <DetailRow
            label="Thời gian"
            value={payment.paymentTime || "Chưa ghi nhận"}
          />
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm text-muted-foreground">Trạng thái</span>
            <StatusBadge variant={getStatusVariant(payment.status)}>
              {statusLabel}
            </StatusBadge>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm", className)}>{value}</span>
    </div>
  );
}
