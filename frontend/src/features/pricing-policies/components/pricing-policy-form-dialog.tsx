// ---------------------------------------------
// Pricing Policy Form Dialog
// Form thêm mới / cập nhật bảng giá
// Sử dụng React Hook Form + Zod Validation
// ---------------------------------------------

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { PricingPolicy } from "@/features/pricing-policies/types/pricing-policy.type";
import {
  pricingPolicySchema,
  PricingPolicyFormValues,
} from "@/features/pricing-policies/schemas/pricing-policy.schema";
import { VehicleType } from "@/features/vehicle-types/types/vehicle-type.type";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";

interface PricingPolicyFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PricingPolicyFormValues) => void;
  defaultValues?: PricingPolicy | null;
  isLoading?: boolean;
  vehicleTypes: VehicleType[];
  isLoadingVehicleTypes?: boolean;
}

/**
 * Chuyển đổi date từ DD-MM-YYYY sang YYYY-MM-DD (cho input type="date")
 */
function toInputDate(ddmmyyyy: string): string {
  const parts = ddmmyyyy.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return ddmmyyyy;
}

/**
 * Chuyển đổi date từ YYYY-MM-DD (input type="date") sang DD-MM-YYYY
 */
function toApiDate(yyyymmdd: string): string {
  const parts = yyyymmdd.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return yyyymmdd;
}

export function PricingPolicyFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isLoading = false,
  vehicleTypes,
  isLoadingVehicleTypes = false,
}: PricingPolicyFormDialogProps) {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PricingPolicyFormValues>({
    resolver: zodResolver(pricingPolicySchema),
    defaultValues: {
      vehicle_type_id: 0,
      base_price: 0,
      extra_fee_per_hour: 0,
      effective_date: "",
    },
  });

  // Reset form khi mở dialog hoặc khi defaultValues thay đổi
  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset({
          vehicle_type_id: defaultValues.vehicle_type_id,
          base_price: defaultValues.base_price,
          extra_fee_per_hour: defaultValues.extra_fee_per_hour,
          effective_date: defaultValues.effective_date,
        });
      } else {
        reset({
          vehicle_type_id: 0,
          base_price: 0,
          extra_fee_per_hour: 0,
          effective_date: "",
        });
      }
    }
  }, [open, defaultValues, reset]);

  const onFormSubmit = (data: PricingPolicyFormValues) => {
    onSubmit(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <FormContainer onSubmit={handleSubmit(onFormSubmit)}>
          <FormHeader
            title={isEditing ? "Cập nhật bảng giá" : "Thêm bảng giá mới"}
            description={isEditing
              ? "Chỉnh sửa thông tin bảng giá bên dưới."
              : "Nhập thông tin bảng giá mới bên dưới."}
          />

          <FormFields>
          {/* Loại phương tiện */}
          <div>
            <label
              htmlFor="vehicle_type_id"
              className="block text-sm font-medium"
            >
              Loại phương tiện <span className="text-destructive">*</span>
            </label>
            <select
              id="vehicle_type_id"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isLoadingVehicleTypes}
              {...register("vehicle_type_id", { valueAsNumber: true })}
            >
              <option value={0}>
                {isLoadingVehicleTypes
                  ? "Đang tải..."
                  : "-- Chọn loại phương tiện --"}
              </option>
              {vehicleTypes.map((vt) => (
                <option key={vt.id} value={vt.id}>
                  {vt.type_name}
                </option>
              ))}
            </select>
            {errors.vehicle_type_id && (
              <p className="mt-1 text-xs text-destructive">
                {errors.vehicle_type_id.message}
              </p>
            )}
          </div>

          {/* Giá cơ bản */}
          <div>
            <label htmlFor="base_price" className="block text-sm font-medium">
              Giá cơ bản (VND) <span className="text-destructive">*</span>
            </label>
            <input
              id="base_price"
              type="number"
              min={0}
              step={1000}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ví dụ: 15000"
              {...register("base_price", { valueAsNumber: true })}
            />
            {errors.base_price && (
              <p className="mt-1 text-xs text-destructive">
                {errors.base_price.message}
              </p>
            )}
          </div>

          {/* Phụ thu mỗi giờ */}
          <div>
            <label
              htmlFor="extra_fee_per_hour"
              className="block text-sm font-medium"
            >
              Phụ thu mỗi giờ (VND) <span className="text-destructive">*</span>
            </label>
            <input
              id="extra_fee_per_hour"
              type="number"
              min={0}
              step={1000}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ví dụ: 5000"
              {...register("extra_fee_per_hour", { valueAsNumber: true })}
            />
            {errors.extra_fee_per_hour && (
              <p className="mt-1 text-xs text-destructive">
                {errors.extra_fee_per_hour.message}
              </p>
            )}
          </div>

          {/* Ngày hiệu lực */}
          <div>
            <label
              htmlFor="effective_date"
              className="block text-sm font-medium"
            >
              Ngày hiệu lực <span className="text-destructive">*</span>
            </label>
            <input
              id="effective_date"
              type="date"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              defaultValue={
                defaultValues?.effective_date
                  ? toInputDate(defaultValues.effective_date)
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setValue("effective_date", val ? toApiDate(val) : "", {
                  shouldValidate: true,
                });
              }}
            />
            {errors.effective_date && (
              <p className="mt-1 text-xs text-destructive">
                {errors.effective_date.message}
              </p>
            )}
          </div>

          </FormFields>

          {/* Actions */}
          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Đang xử lý..."
                : isEditing
                  ? "Cập nhật"
                  : "Lưu"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
