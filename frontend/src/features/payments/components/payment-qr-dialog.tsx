"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";

interface PaymentQrDialogProps {
  open: boolean;
  onClose: () => void;
  paymentUrl: string | null;
  amount: number | null;
}

export function PaymentQrDialog({
  open,
  onClose,
  paymentUrl,
  amount,
}: PaymentQrDialogProps) {
  if (!open || !paymentUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-sm rounded-lg border bg-background p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Thanh toán VNPAY</h2>
            <p className="text-sm text-muted-foreground">
              Vui lòng quét mã QR dưới đây để thanh toán
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <QRCodeSVG value={paymentUrl} size={200} level="M" />
          </div>

          {amount !== null && (
            <div className="text-xl font-bold text-primary">
              {amount.toLocaleString()} VND
            </div>
          )}

          <div className="w-full pt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => window.open(paymentUrl, "_blank")}
            >
              Mở trang thanh toán <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="secondary" className="w-full text-destructive hover:bg-destructive/10" onClick={onClose}>
              Hủy giao dịch (Đóng QR)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
