/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";
import { SlotStatus } from "@/constants/slot-status";
import { slotSchema, type SlotFormValues } from "../schemas/slot.schema";
import { useFloors } from "@/features/floors/hooks/use-floors";
import { cn } from "@/lib/utils";

interface SlotFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SlotFormValues) => void;
  isLoading?: boolean;
}

export function SlotFormDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: SlotFormDialogProps) {
  const { data: floors = [], isLoading: isLoadingFloors } = useFloors();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SlotFormValues>({
    resolver: zodResolver(slotSchema) as any,
    defaultValues: {
      floorId: 0,
      slotName: "",
      status: SlotStatus.AVAILABLE,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        floorId: 0,
        slotName: "",
        status: SlotStatus.AVAILABLE,
      });
    }
  }, [open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <FormHeader 
            title="Thêm vị trí đỗ xe mới"
            description="Tạo một ô đỗ xe mới cho tầng tương ứng."
          />
          <FormFields>
            <div className="space-y-1">
              <label htmlFor="floorId" className="text-sm font-medium leading-none">
                Tầng đỗ xe <span className="text-destructive">*</span>
              </label>
              <select
                id="floorId"
                {...register("floorId")}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  errors.floorId && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoadingFloors}
              >
                <option value={0} disabled>
                  -- Chọn tầng --
                </option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floorName} - {floor.buildingName}
                  </option>
                ))}
              </select>
              {errors.floorId && (
                <span className="text-sm text-destructive">
                  {errors.floorId.message}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="slotName" className="text-sm font-medium leading-none">
                Tên / Mã vị trí <span className="text-destructive">*</span>
              </label>
              <Input
                id="slotName"
                placeholder="VD: A01, B12"
                {...register("slotName")}
                className={errors.slotName ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.slotName && (
                <span className="text-sm text-destructive">
                  {errors.slotName.message}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="status" className="text-sm font-medium leading-none">
                Trạng thái <span className="text-destructive">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  errors.status && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <option value="AVAILABLE">Còn trống</option>
                <option value="OCCUPIED">Đang đỗ</option>
                <option value="RESERVED">Đã đặt trước</option>
                <option value="MAINTENANCE">Bảo trì</option>
                <option value="LOCKED">Đã khóa</option>
              </select>
              {errors.status && (
                <span className="text-sm text-destructive">
                  {errors.status.message}
                </span>
              )}
            </div>
          </FormFields>

          <FormActions>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
