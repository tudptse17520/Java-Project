/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ---------------------------------------------
// Payment Manual Status Dialog
// Form cho Staff cập nhật trạng thái thủ công
// Sử dụng React Hook Form + Zod Validation
// ---------------------------------------------

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  manualStatusSchema,
  type ManualStatusFormValues,
} from "@/features/payments/schemas/payment.schema";
import { MANUAL_STATUS_OPTIONS } from "@/features/payments/constants/payment.constants";
import type { Payment } from "@/features/payments/types/payment.type";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";
import { Portal } from "@/components/common/portal";

interface PaymentManualStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ManualStatusFormValues) => void;
  payment: Payment | null;
  isLoading: boolean;
}

export function PaymentManualStatusDialog({
  open,
  onClose,
  onSubmit,
  payment,
  isLoading,
}: PaymentManualStatusDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualStatusFormValues>({
    resolver: zodResolver(manualStatusSchema),
    defaultValues: {
      note: "",
    } as any,
  });

  if (!open || !payment) return null;

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit(values as ManualStatusFormValues);
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <FormContainer onSubmit={handleFormSubmit}>
          <FormHeader
            title="Cập nhật trạng thái thủ công"
            description={`Giao dịch #${payment.id} — Đang ở trạng thái PENDING`}
          />

          <FormFields>
          {/* Trạng thái mới */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Trạng thái mới <span className="text-destructive">*</span>
            </label>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("status")}
            >
              <option value="">-- Chọn trạng thái --</option>
              {MANUAL_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-xs text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Ghi chú lý do */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Lý do thao tác thủ công{" "}
              <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Nhập lý do chi tiết (tối thiểu 10 ký tự)..."
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("note")}
            />
            {errors.note && (
              <p className="text-xs text-destructive">
                {errors.note.message}
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
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
    </Portal>
  );
}

