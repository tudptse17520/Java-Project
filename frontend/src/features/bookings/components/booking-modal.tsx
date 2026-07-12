"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/features/bookings/schemas/booking-form.schema";
import {
  FormContainer,
  FormHeader,
  FormFields,
  FormActions,
} from "@/components/common/form-container";
import { Portal } from "@/components/common/portal";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormValues) => void;
  isLoading?: boolean;
}

export function BookingModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: BookingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      vehicleId: 0,
      parkingSlotId: 0,
      expectedTimeIn: "",
      expectedTimeOut: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        vehicleId: 0,
        parkingSlotId: 0,
        expectedTimeIn: "",
        expectedTimeOut: "",
      });
    }
  }, [open, reset]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Dialog Content */}
        <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title="Tạo mới đặt chỗ"
              description="Đặt trước vị trí đỗ xe để được giữ chỗ."
            />

            <FormFields>
              {/* Vehicle ID */}
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none">
                  Mã Xe (Vehicle ID) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Nhập ID xe của bạn"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.vehicleId && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("vehicleId", { valueAsNumber: true })}
                />
                {errors.vehicleId && (
                  <p className="text-sm text-destructive">
                    {errors.vehicleId.message}
                  </p>
                )}
              </div>

              {/* Parking Slot ID */}
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none">
                  Mã Vị trí đỗ (Slot ID) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Nhập ID vị trí đỗ trống"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.parkingSlotId && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("parkingSlotId", { valueAsNumber: true })}
                />
                {errors.parkingSlotId && (
                  <p className="text-sm text-destructive">
                    {errors.parkingSlotId.message}
                  </p>
                )}
              </div>

              {/* Expected Time In */}
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none">
                  Thời gian dự kiến vào <span className="text-destructive">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.expectedTimeIn && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("expectedTimeIn")}
                />
                {errors.expectedTimeIn && (
                  <p className="text-sm text-destructive">
                    {errors.expectedTimeIn.message}
                  </p>
                )}
              </div>

              {/* Expected Time Out */}
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none">
                  Thời gian dự kiến ra <span className="text-destructive">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.expectedTimeOut && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("expectedTimeOut")}
                />
                {errors.expectedTimeOut && (
                  <p className="text-sm text-destructive">
                    {errors.expectedTimeOut.message}
                  </p>
                )}
              </div>
            </FormFields>

            <FormActions>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đặt chỗ"}
              </Button>
            </FormActions>
          </FormContainer>
        </div>
      </div>
    </Portal>
  );
}
