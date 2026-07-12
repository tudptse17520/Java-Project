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


import { useSessionById, usePaymentDebt, useBookingById } from "@/features/payments/hooks/use-payments";

/**
 * Format chuỗi thời gian ISO
 */
function formatDateTime(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function PaymentDetailDialog({
  open,
  onClose,
  payment,
}: PaymentDetailDialogProps) {
  const { data: sessionData, isLoading: isSessionLoading } = useSessionById(
    payment?.parkingSessionId ?? null
  );

  const { data: bookingData, isLoading: isBookingLoading } = useBookingById(
    payment?.bookingId ?? null
  );

  const { data: debtInfo, isLoading: isDebtLoading } = usePaymentDebt(
    payment?.parkingSessionId ?? null
  );

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

        <div className="mt-4 space-y-3">
          <DetailRow label="Mã giao dịch" value={`#${payment.id}`} />
          {payment.parkingSessionId != null && (
            <DetailRow label="Mã lượt gửi xe" value={`#${payment.parkingSessionId}`} />
          )}
          {payment.bookingId != null && (
            <DetailRow label="Mã đặt chỗ" value={`#${payment.bookingId}`} />
          )}
          <DetailRow
            label="Số tiền thanh toán"
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
            value={payment.paymentTime ? formatDateTime(payment.paymentTime) : "Chưa ghi nhận"}
          />
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm text-muted-foreground">Trạng thái</span>
            <StatusBadge variant={getStatusVariant(payment.status)}>
              {statusLabel}
            </StatusBadge>
          </div>

          {/* Booking Details */}
          {payment.parkingSessionId == null && payment.bookingId != null && (
            <div className="rounded-md bg-muted p-3 space-y-2 mt-2 mb-2">
              <div className="flex flex-col mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Thông tin cọc đặt chỗ
                </p>
              </div>
              {isBookingLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải thông tin đặt chỗ...</p>
              ) : bookingData ? (
                <>
                  <DetailRow label="Mã vị trí đỗ" value={bookingData.parking_slot_id ? `#${bookingData.parking_slot_id}` : "—"} />
                  <DetailRow label="Giờ vào dự kiến" value={formatDateTime(bookingData.expected_time_in)} />
                  <DetailRow label="Trạng thái" value={bookingData.status || "—"} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Không tìm thấy thông tin đặt chỗ.</p>
              )}
            </div>
          )}

          {/* Session Details */}
          {payment.parkingSessionId != null && (
            <div className="rounded-md bg-muted p-3 space-y-2 mt-2 mb-2">
              <div className="flex flex-col mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Thông tin lượt gửi xe
                </p>
                <p className="text-[10px] text-orange-500/80 italic mt-0.5">
                  * Trạng thái và dư nợ tại thời điểm hiện tại
                </p>
              </div>
              {isSessionLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải thông tin xe...</p>
              ) : sessionData ? (
                <>
                  <DetailRow label="Biển số xe" value={sessionData.plate || "—"} />
                  <DetailRow label="Giờ vào" value={formatDateTime(sessionData.time_in)} />
                  <DetailRow label="Giờ ra" value={sessionData.time_out ? formatDateTime(sessionData.time_out) : "Chưa ra"} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Không tìm thấy thông tin lượt gửi xe.</p>
              )}

              {/* Debt Info inside Session block */}
              {isDebtLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải thông tin phí...</p>
              ) : debtInfo ? (
                <div className="mt-2 border-t border-dashed border-gray-300 pt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Tổng phí đỗ xe:</span>
                    <span>{formatVND(debtInfo.total_fee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Đã thanh toán:</span>
                    <span className="text-green-600">{formatVND(debtInfo.paid_fee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700">Nợ còn lại:</span>
                    <span className="text-destructive">{formatVND(debtInfo.remaining_fee)}</span>
                  </div>
                </div>
              ) : (
                sessionData && sessionData.total_fee != null && (
                  <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
                    <DetailRow label="Tổng phí đỗ xe" value={formatVND(sessionData.total_fee)} />
                  </div>
                )
              )}
            </div>
          )}
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
