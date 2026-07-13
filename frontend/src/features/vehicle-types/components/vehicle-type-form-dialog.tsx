"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  vehicleTypeSchema,
  type VehicleTypeFormValues,
} from "@/features/vehicle-types/schemas/vehicle-type.schema";
import { VehicleType } from "@/features/vehicle-types/types/vehicle-type.type";
import { VehicleTypeStatus } from "@/constants/vehicle-type-status";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";
import { Portal } from "@/components/common/portal";

interface VehicleTypeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleTypeFormValues) => void;
  initialData?: VehicleType | null;
  isLoading?: boolean;
}

export function VehicleTypeFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: VehicleTypeFormDialogProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleTypeFormValues>({
    resolver: zodResolver(vehicleTypeSchema),
    defaultValues: {
      typeName: "",
      description: "",
      status: VehicleTypeStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        typeName: initialData.typeName,
        description: initialData.description || "",
        status: initialData.status,
      });
    } else {
      reset({
        typeName: "",
        description: "",
        status: VehicleTypeStatus.ACTIVE,
      });
    }
  }, [initialData, reset, open]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <FormHeader 
            title={isEditing ? "Cập nhật loại phương tiện" : "Thêm loại phương tiện"}
            description={isEditing
              ? "Thay đổi thông tin của loại phương tiện hiện tại."
              : "Thêm một loại phương tiện mới vào hệ thống."}
          />
          <FormFields>
          {/* Type Name */}
          <div className="space-y-1">
            <label
              htmlFor="typeName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tên loại phương tiện <span className="text-destructive">*</span>
            </label>
            <input
              id="typeName"
              type="text"
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.typeName && "border-destructive focus-visible:ring-destructive"
              )}
              placeholder="VD: Xe máy, Ô tô..."
              {...register("typeName")}
            />
            {errors.typeName && (
              <p className="text-sm text-destructive">{errors.typeName.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.description && "border-destructive focus-visible:ring-destructive"
              )}
              placeholder="Nhập mô tả (không bắt buộc)..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="status" className="text-sm font-medium leading-none">
              Trạng thái <span className="text-destructive">*</span>
            </label>
            <select
              id="status"
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                errors.status && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("status")}
            >
              <option value={VehicleTypeStatus.ACTIVE}>Đang áp dụng</option>
              <option value={VehicleTypeStatus.INACTIVE}>Ngừng áp dụng</option>
            </select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          </FormFields>

          {/* Action Buttons */}
          <FormActions>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu lại"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
    </Portal>
  );
}
