"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as paymentService from "@/services/payment.service";
import { formatCurrency } from "@/utils/format-currency";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
// Removed PaymentMethod import

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: number;
}

export function PaymentModal({ open, onOpenChange, sessionId }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: debtInfo, isLoading } = useQuery({
    queryKey: ["payment-debt", sessionId],
    queryFn: () => paymentService.getRemainingDebt(sessionId),
    enabled: open && !!sessionId,
  });

  const handlePay = async () => {
    if (!debtInfo) return;

    if (debtInfo.remaining_fee <= 0) {
      toast.success("Lượt gửi xe này đã được thanh toán đủ.");
      onOpenChange(false);
      return;
    }

    try {
      setIsProcessing(true);
      const paymentResponse = await paymentService.createPayment({
        parkingSessionId: sessionId,
        amount: debtInfo.remaining_fee,
        paymentMethod: "Vnpay", // Mặc định dùng Vnpay
        feeType: "Parking_Fee",
      });

      if (paymentResponse.payment_url) {
        window.location.href = paymentResponse.payment_url;
      } else {
        toast.error("Không nhận được đường dẫn thanh toán.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thanh toán phí gửi xe</DialogTitle>
          <DialogDescription>
            Chi tiết các khoản phí cho lượt gửi xe của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : debtInfo ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Tổng phí:</span>
                <span className="font-medium">{formatCurrency(debtInfo.total_fee)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Đã thanh toán (bao gồm cọc):</span>
                <span className="font-medium">{formatCurrency(debtInfo.paid_fee)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Cần thanh toán:</span>
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(debtInfo.remaining_fee)}
                </span>
              </div>

              {debtInfo.remaining_fee > 0 ? (
                <div className="pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Phương thức thanh toán:</p>
                  <Button
                    className="w-full justify-between h-12"
                    variant="outline"
                    onClick={handlePay}
                    disabled={isProcessing}
                  >
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                      <span className="font-medium">Thanh toán qua VNPAY</span>
                    </div>
                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                  </Button>
                </div>
              ) : (
                <div className="pt-4 text-center text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-md border border-emerald-200">
                  Bạn không có khoản nợ nào cần thanh toán cho lượt gửi xe này.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Không thể tải thông tin thanh toán.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
