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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 to-blue-600"></div>
        <div className="p-6">
          <FormContainer onSubmit={handleSubmit(onFormSubmit)}>
            <FormHeader
              title={isEditing ? "Cập nhật bảng giá" : "Thêm bảng giá mới"}
              description={isEditing
                ? "Chỉnh sửa thông tin mức phí và thời gian áp dụng."
                : "Thiết lập thông tin bảng giá cho loại phương tiện."}
            />

            <FormFields>
            <div className="space-y-4 py-4">
              {/* Loại phương tiện */}
              <div className="space-y-1.5">
                <label
                  htmlFor="vehicle_type_id"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Loại phương tiện <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    id="vehicle_type_id"
                    className="appearance-none mt-1 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:bg-slate-50 disabled:opacity-50"
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.vehicle_type_id && (
                  <p className="text-xs font-medium text-destructive animate-in slide-in-from-top-1">
                    {errors.vehicle_type_id.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Giá cơ bản */}
                <div className="space-y-1.5">
                  <label htmlFor="base_price" className="block text-sm font-semibold text-slate-700">
                    Giá cơ bản <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="base_price"
                      type="number"
                      min={0}
                      step={1000}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 pl-10 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:font-normal"
                      placeholder="Ví dụ: 15000"
                      {...register("base_price", { valueAsNumber: true })}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₫</span>
                  </div>
                  {errors.base_price && (
                    <p className="text-xs font-medium text-destructive animate-in slide-in-from-top-1">
                      {errors.base_price.message}
                    </p>
                  )}
                </div>

                {/* Phụ thu mỗi giờ */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="extra_fee_per_hour"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Phụ thu / giờ <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="extra_fee_per_hour"
                      type="number"
                      min={0}
                      step={1000}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 pl-10 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:font-normal"
                      placeholder="Ví dụ: 5000"
                      {...register("extra_fee_per_hour", { valueAsNumber: true })}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₫</span>
                  </div>
                  {errors.extra_fee_per_hour && (
                    <p className="text-xs font-medium text-destructive animate-in slide-in-from-top-1">
                      {errors.extra_fee_per_hour.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Ngày hiệu lực */}
              <div className="space-y-1.5">
                <label
                  htmlFor="effective_date"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Ngày hiệu lực <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="effective_date"
                    type="date"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:bg-slate-50 cursor-pointer"
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
                </div>
                {errors.effective_date && (
                  <p className="text-xs font-medium text-destructive animate-in slide-in-from-top-1">
                    {errors.effective_date.message}
                  </p>
                )}
              </div>
            </div>
            </FormFields>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-6 font-semibold"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl px-6 font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading
                  ? "Đang xử lý..."
                  : isEditing
                    ? "Lưu cập nhật"
                    : "Lưu bảng giá"}
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
