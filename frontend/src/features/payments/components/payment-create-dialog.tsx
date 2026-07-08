// ---------------------------------------------
// Payment Create Dialog
// Form tạo thanh toán mới
// Sử dụng React Hook Form + Zod Validation
// ---------------------------------------------

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  createPaymentSchema,
  type CreatePaymentFormValues,
} from "@/features/payments/schemas/payment.schema";
import {
  PAYMENT_METHODS,
  FEE_TYPES,
} from "@/features/payments/constants/payment.constants";

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
    formState: { errors },
  } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      parking_session_id: null,
      booking_id: null,
      payment_method: "",
      fee_type: "",
    } as any,
  });

  if (!open) return null;

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit(values as CreatePaymentFormValues);
  });

  const handleClose = () => {
    reset();
    onClose();
  };

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
        <h2 className="text-lg font-semibold">Tạo thanh toán mới</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Nhập thông tin giao dịch thanh toán.
        </p>

        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          {/* Mã lượt gửi xe */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Mã lượt gửi xe (parking_session_id)
            </label>
            <input
              type="number"
              placeholder="Nhập mã lượt gửi xe..."
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("parking_session_id", { valueAsNumber: true })}
            />
            {errors.parking_session_id && (
              <p className="text-xs text-destructive">
                {errors.parking_session_id.message}
              </p>
            )}
          </div>

          {/* Mã đặt chỗ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Mã đặt chỗ (booking_id)
            </label>
            <input
              type="number"
              placeholder="Nhập mã đặt chỗ..."
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("booking_id", { valueAsNumber: true })}
            />
            {errors.booking_id && (
              <p className="text-xs text-destructive">
                {errors.booking_id.message}
              </p>
            )}
          </div>

          {/* Số tiền */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Số tiền (VND) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              placeholder="Nhập số tiền..."
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Phương thức thanh toán */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Phương thức thanh toán <span className="text-destructive">*</span>
            </label>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("payment_method")}
            >
              <option value="">-- Chọn phương thức --</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            {errors.payment_method && (
              <p className="text-xs text-destructive">
                {errors.payment_method.message}
              </p>
            )}
          </div>

          {/* Loại phí */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Loại phí <span className="text-destructive">*</span>
            </label>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("fee_type")}
            >
              <option value="">-- Chọn loại phí --</option>
              {FEE_TYPES.map((type) => (
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Tạo thanh toán"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
