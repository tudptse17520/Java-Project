// ---------------------------------------------
// Payment Create Dialog
// Form tạo thanh toán mới
// Sử dụng React Hook Form + Zod Validation
// ---------------------------------------------

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  createPaymentSchema,
  type CreatePaymentFormValues,
} from "@/features/payments/schemas/payment.schema";
import { usePaymentDebt, useSessionByPlate } from "@/features/payments/hooks/use-payments";
import {
  PAYMENT_METHODS,
  FEE_TYPES,
} from "@/features/payments/constants/payment.constants";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";

interface PaymentCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreatePaymentFormValues) => void;
  isLoading: boolean;
}

export function PaymentCreateDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: PaymentCreateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePaymentFormValues & { plate?: string }>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      plate: "",
      parking_session_id: null,
      booking_id: null,
      payment_method: "",
      fee_type: "",
    } as any,
  });

  const plateValue = watch("plate");
  const parkingSessionId = watch("parking_session_id");
  const feeType = watch("fee_type");
  const paymentMethod = watch("payment_method");
  const amount = watch("amount");

  // State for debounced plate searching
  const [searchPlate, setSearchPlate] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchPlate(plateValue || "");
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [plateValue]);

  const { data: sessionData, isLoading: isSessionLoading, isError: isSessionError } = useSessionByPlate(searchPlate);

  // Auto-fill parking_session_id when session is found
  useEffect(() => {
    if (sessionData && sessionData.id) {
      setValue("parking_session_id", sessionData.id);
    } else {
      setValue("parking_session_id", null);
      setValue("amount", NaN); // Reset amount if no session
    }
  }, [sessionData, setValue]);

  const { data: debtInfo, isLoading: isDebtLoading } = usePaymentDebt(
    parkingSessionId ? Number(parkingSessionId) : null
  );

  // Auto-fill amount based on fee_type and debtInfo
  useEffect(() => {
    if (feeType === "PARKING_FEE" && debtInfo) {
      setValue("amount", debtInfo.remaining_fee, { shouldValidate: true });
    } else if (feeType === "LOST_TICKET_FINE") {
      setValue("amount", 200000, { shouldValidate: true });
    } else {
      setValue("amount", NaN, { shouldValidate: true });
    }
  }, [feeType, debtInfo, setValue]);

  if (!open) return null;

  const handleFormSubmit = handleSubmit((values) => {
    // Clean up plate from values if present before passing to submit
    const { plate, ...submitValues } = values as any;
    onSubmit(submitValues as CreatePaymentFormValues);
  });

  const handleClose = () => {
    reset();
    setSearchPlate("");
    onClose();
  };

  const hasValidSession = !!parkingSessionId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <FormContainer onSubmit={handleFormSubmit}>
          <FormHeader
            title="Tạo thanh toán mới"
            description="Nhập thông tin giao dịch thanh toán."
          />

          <FormFields>
            {/* 1. Biển số xe */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Biển số xe (Plate) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập biển số xe (VD: 51A-12345)..."
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register("plate")}
                />
                {isSessionLoading && (
                  <span className="absolute right-3 top-2 text-xs text-muted-foreground">Đang tìm...</span>
                )}
              </div>
              
              {/* Trạng thái tìm kiếm Session */}
              {searchPlate.length >= 3 && !isSessionLoading && !sessionData && (
                <p className="text-xs text-destructive">Không tìm thấy lượt gửi xe (IN_PROGRESS) cho biển số này.</p>
              )}
            </div>

            {/* 2. Mã lượt gửi xe (Read-only) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Mã lượt gửi xe (parking_session_id)
              </label>
              <div className="relative">
                <input
                  type="number"
                  readOnly
                  placeholder="Tự động điền khi tìm thấy xe..."
                  className="h-9 w-full rounded-md border border-input bg-muted px-3 text-sm opacity-70 focus:outline-none"
                  {...register("parking_session_id", { valueAsNumber: true })}
                />
                {sessionData && (
                  <span className="absolute right-3 top-2 text-xs font-semibold text-primary">
                    Tìm thấy xe
                  </span>
                )}
              </div>
            </div>


            {/* 3. Loại phí */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Loại phí <span className="text-destructive">*</span>
              </label>
              <select
                disabled={!hasValidSession}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("fee_type")}
              >
                <option value="">-- Chọn loại phí --</option>
                {FEE_TYPES.filter(type => type.value !== "BOOKING_DEPOSIT").map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.fee_type && (
                <p className="text-xs text-destructive">
                  {errors.fee_type.message}
                </p>
              )}
            </div>

            {/* 4. Phương thức thanh toán */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Phương thức thanh toán <span className="text-destructive">*</span>
              </label>
              <select
                disabled={!hasValidSession || !feeType}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("payment_method")}
              >
                <option value="">-- Chọn phương thức --</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {paymentMethod === "MOMO" && (
                <p className="text-xs text-orange-500 font-medium italic mt-1">
                  * Tính năng thanh toán qua MoMo hiện đang được phát triển.
                </p>
              )}
              {errors.payment_method && (
                <p className="text-xs text-destructive">
                  {errors.payment_method.message}
                </p>
              )}
            </div>

            {/* 5. Số tiền (Read-only tính tự động) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Số tiền (VND) <span className="text-destructive">*</span>
              </label>

              {!(feeType === "PARKING_FEE" && parkingSessionId) ? (
                <>
                  <input
                    type="number"
                    readOnly
                    placeholder="Số tiền sẽ được tự động tính..."
                    className="h-9 rounded-md border border-input bg-muted opacity-70 px-3 text-sm font-bold text-primary focus:outline-none"
                    {...register("amount", { valueAsNumber: true })}
                  />
                </>
              ) : (
                <>
                  <input type="hidden" {...register("amount", { valueAsNumber: true })} />
                  {/* Hiển thị chi tiết thông tin dư nợ cho Staff giải thích */}
                  <div className="mt-1 rounded-md bg-slate-50 border p-3 text-sm">
                    {isDebtLoading ? (
                      <p className="text-muted-foreground text-xs italic">Đang tải thông tin phí từ hệ thống...</p>
                    ) : debtInfo ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Tổng phí phải thu:</span>
                          <span className="font-medium">{debtInfo.total_fee.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Đã thanh toán trước đó:</span>
                          <span className="font-medium text-green-600">{debtInfo.paid_fee.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed pt-2 mt-1">
                          <span className="font-semibold text-slate-700">Cần thu thêm lúc này:</span>
                          <span className="font-bold text-destructive text-base">{debtInfo.remaining_fee.toLocaleString()} VND</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">Không thể lấy thông tin nợ.</p>
                    )}
                  </div>
                </>
              )}
              
              {/* Thông báo khi không phát sinh phí (Số tiền = 0) */}
              {amount === 0 && feeType === "PARKING_FEE" && (
                <div className="mt-1 p-2 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Giao dịch đã hoàn tất hoặc không phát sinh phí mới.
                </div>
              )}
            </div>

          </FormFields>

          {/* Actions */}
          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !hasValidSession || !feeType || isDebtLoading || paymentMethod === "MOMO" || amount === 0}>
              {isLoading ? "Đang xử lý..." : "Tạo thanh toán"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
