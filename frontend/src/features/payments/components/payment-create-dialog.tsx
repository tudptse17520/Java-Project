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
    formState: { errors },
  } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      parkingSessionId: null,
      bookingId: null,
      paymentMethod: "",
      feeType: "",
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
        <FormContainer onSubmit={handleFormSubmit}>
          <FormHeader
            title="Tạo thanh toán mới"
            description="Nhập thông tin giao dịch thanh toán."
          />

          <FormFields>
          {/* Mã lượt gửi xe */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Mã lượt gửi xe (parkingSessionId)
            </label>
            <input
              type="number"
              placeholder="Nhập mã lượt gửi xe..."
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("parkingSessionId", { valueAsNumber: true })}
            />
            {errors.parkingSessionId && (
              <p className="text-xs text-destructive">
                {errors.parkingSessionId.message}
              </p>
            )}
          </div>

          {/* Mã đặt chỗ */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Mã đặt chỗ (bookingId)
            </label>
            <input
              type="number"
              placeholder="Nhập mã đặt chỗ..."
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("bookingId", { valueAsNumber: true })}
            />
            {errors.bookingId && (
              <p className="text-xs text-destructive">
                {errors.bookingId.message}
              </p>
            )}
          </div>

          {/* Số tiền */}
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Phương thức thanh toán <span className="text-destructive">*</span>
            </label>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("paymentMethod")}
            >
              <option value="">-- Chọn phương thức --</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className="text-xs text-destructive">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Loại phí */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Loại phí <span className="text-destructive">*</span>
            </label>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("feeType")}
            >
              <option value="">-- Chọn loại phí --</option>
              {FEE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.feeType && (
              <p className="text-xs text-destructive">
                {errors.feeType.message}
              </p>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Tạo thanh toán"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
