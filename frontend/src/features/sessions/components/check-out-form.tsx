"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

import { useSessions } from "../hooks/use-sessions";
import { useCheckoutActions } from "../hooks/use-checkout-actions";
import {
  ValidatePlateFormValues,
  validatePlateSchema,
} from "../schemas/checkout.schema";
import { FeeCalculationResponse, ParkingSession } from "../types/session.type";
import { CHECKOUT_MESSAGES } from "../constants/session.constants";

import { OverrideCheckoutDialog } from "./override-checkout-dialog";
import { LostTicketDialog } from "./lost-ticket-dialog";

export function CheckOutForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<ParkingSession | null>(null);
  const [feeData, setFeeData] = useState<FeeCalculationResponse | null>(null);
  
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isLostTicketOpen, setIsLostTicketOpen] = useState(false);

  const { data: sessionsData, isLoading: isSearching } = useSessions({
    plate: searchTerm,
    status: "IN_PROGRESS" as any,
    enabled: searchTerm.length > 0,
  });

  const {
    validatePlateMutation,
    calculateFeeMutation,
    checkOutMutation,
  } = useCheckoutActions();

  const validateForm = useForm<ValidatePlateFormValues>({
    resolver: zodResolver(validatePlateSchema),
    defaultValues: { plate_out: "" },
  });

  const handleSearch = () => {
    if (sessionsData && sessionsData.data.length > 0) {
      setSelectedSession(sessionsData.data[0]);
      setFeeData(null);
      validateForm.reset();
    } else {
      toast.error("Không tìm thấy xe đang gửi với biển số này");
    }
  };

  const onValidateSubmit = (values: ValidatePlateFormValues) => {
    if (!selectedSession) return;

    validatePlateMutation.mutate(
      {
        sessionId: selectedSession.id,
        request: {
          plate_out: values.plate_out,
          plate_out_image: "dummy_image_url_base64",
        },
      },
      {
        onSuccess: () => {
          toast.success(CHECKOUT_MESSAGES.VALIDATION_SUCCESS);
          // If valid, calculate fee
          calculateFeeMutation.mutate(selectedSession.id, {
            onSuccess: (data) => setFeeData(data),
            onError: () => toast.error("Lỗi khi tính cước phí"),
          });
        },
        onError: (error: any) => {
          const status = error.response?.status;
          if (status === 409) {
            toast.error(CHECKOUT_MESSAGES.VALIDATION_ERROR);
            setIsOverrideOpen(true);
          } else {
            toast.error(error.response?.data?.message || "Lỗi xác thực biển số");
          }
        },
      }
    );
  };

  const handleCheckout = () => {
    if (!selectedSession) return;
    
    checkOutMutation.mutate(
      {
        sessionId: selectedSession.id,
        request: {},
      },
      {
        onSuccess: () => {
          toast.success(CHECKOUT_MESSAGES.SUCCESS);
          setSelectedSession(null);
          setFeeData(null);
          setSearchTerm("");
        },
        onError: (error: any) => {
          if (error.response?.status === 402) {
            toast.error(CHECKOUT_MESSAGES.PAYMENT_REQUIRED);
          } else {
            toast.error(error.response?.data?.message || "Lỗi khi Check-out");
          }
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cột trái: Tìm kiếm & Validate */}
      <div className="space-y-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Tra cứu xe ra</h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div className="flex gap-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nhập biển số xe hoặc mã vé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>

        {selectedSession && (
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Xác thực biển số</h3>
            </div>
            <div className="p-6 pt-0">
              <form onSubmit={validateForm.handleSubmit(onValidateSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Biển số lúc ra <span className="text-destructive">*</span></label>
                  <input
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      validateForm.formState.errors.plate_out && "border-destructive focus-visible:ring-destructive"
                    )}
                    placeholder="Quét biển số..."
                    {...validateForm.register("plate_out")}
                  />
                  {validateForm.formState.errors.plate_out && (
                    <p className="text-sm text-destructive">
                      {validateForm.formState.errors.plate_out.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={validatePlateMutation.isPending}>
                    {validatePlateMutation.isPending ? "Đang xác thực..." : "Xác thực & Tính tiền"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsLostTicketOpen(true)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Báo mất vé
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Cột phải: Thông tin Session & Tính tiền */}
      <div className="space-y-6">
        {selectedSession ? (
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Thông tin lượt gửi</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Mã phiên</p>
                  <p className="font-medium">#{selectedSession.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Biển số lúc vào</p>
                  <p className="font-medium text-primary text-lg">{selectedSession.plate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Thời gian vào</p>
                  <p className="font-medium">{formatDate(selectedSession.time_in)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trạng thái</p>
                  <StatusBadge variant="warning">{selectedSession.status || "IN_PROGRESS"}</StatusBadge>
                </div>
              </div>

              {feeData && (
                <div className="mt-6 pt-6 border-t space-y-4">
                  <h3 className="font-semibold text-lg">Chi tiết cước phí</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí cơ bản:</span>
                      <span>{formatCurrency(feeData.base_fee)}</span>
                    </div>
                    {feeData.overtime_fee > 0 && (
                      <div className="flex justify-between text-warning">
                        <span>Phụ thu quá giờ:</span>
                        <span>{formatCurrency(feeData.overtime_fee)}</span>
                      </div>
                    )}
                    {feeData.penalty_fee > 0 && (
                      <div className="flex justify-between text-destructive">
                        <span>Phạt mất vé:</span>
                        <span>{formatCurrency(feeData.penalty_fee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{formatCurrency(feeData.total_fee)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={checkOutMutation.isPending}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {checkOutMutation.isPending ? "Đang xử lý..." : "Xác nhận thu tiền & Mở cổng"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
            Vui lòng tìm kiếm phiên gửi xe để tiếp tục
          </div>
        )}
      </div>

      {selectedSession && (
        <>
          <OverrideCheckoutDialog
            sessionId={selectedSession.id}
            isOpen={isOverrideOpen}
            onClose={() => setIsOverrideOpen(false)}
            onSuccess={() => {
              // Automatically calculate fee after override success
              calculateFeeMutation.mutate(selectedSession.id, {
                onSuccess: (data) => setFeeData(data),
              });
            }}
          />
          
          <LostTicketDialog
            sessionId={selectedSession.id}
            isOpen={isLostTicketOpen}
            onClose={() => setIsLostTicketOpen(false)}
            onSuccess={(data) => {
              // Lost ticket API returns FeeCalculationResponse directly
              setFeeData(data);
            }}
          />
        </>
      )}
    </div>
  );
}
