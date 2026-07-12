/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { floorSchema, type FloorFormValues } from "../schemas/floor.schema";
import { Floor } from "../types/floor.type";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";
import { useBuildings } from "@/features/buildings/hooks/use-buildings";
// import useVehicleTypes from features if needed, wait, I need to know if vehicle type hook exists
import { useQuery } from "@tanstack/react-query";
import { getVehicleTypes } from "@/services/vehicle-type.service";

interface FloorFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FloorFormValues) => void;
  initialData?: Floor | null;
  isLoading?: boolean;
}

export function FloorFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: FloorFormDialogProps) {
  const isEditing = !!initialData;

  const { data: buildingsData } = useBuildings();
  const buildings = buildingsData?.data || [];

  // TODO: Refactor this to use feature hook when it's implemented correctly
  const { data: vehicleTypes } = useQuery({
    queryKey: ['vehicle-types'],
    queryFn: () => getVehicleTypes(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema as any),
    defaultValues: {
      floorName: "",
      floorLevel: 1,
      capacity: 100,
      buildingId: 0,
      vehicleTypeId: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        floorName: initialData.floorName,
        floorLevel: initialData.floorLevel,
        capacity: initialData.capacity,
        buildingId: initialData.buildingId,
        vehicleTypeId: initialData.vehicleTypeId,
      });
    } else {
      reset({
        floorName: "",
        floorLevel: 1,
        capacity: 100,
        buildingId: buildings.length > 0 ? buildings[0].id : 0,
        vehicleTypeId: vehicleTypes && vehicleTypes.length > 0 ? vehicleTypes[0].id : 0,
      });
    }
  }, [initialData, reset, open, buildings, vehicleTypes]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <FormHeader 
            title={isEditing ? "Cập nhật tầng đỗ xe" : "Thêm tầng đỗ xe"}
            description={isEditing
              ? "Thay đổi thông tin tầng đỗ xe hiện tại."
              : "Thêm một tầng đỗ xe mới vào hệ thống."}
          />
          <FormFields>
            <div className="space-y-1">
              <label htmlFor="floorName" className="text-sm font-medium leading-none">
                Tên tầng <span className="text-destructive">*</span>
              </label>
              <input
                id="floorName"
                type="text"
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  errors.floorName && "border-destructive focus-visible:ring-destructive"
                )}
                placeholder="VD: Tầng hầm B1"
                {...register("floorName")}
              />
              {errors.floorName && <p className="text-sm text-destructive">{errors.floorName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="floorLevel" className="text-sm font-medium leading-none">
                  Cấp độ tầng <span className="text-destructive">*</span>
                </label>
                <input
                  id="floorLevel"
                  type="number"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    errors.floorLevel && "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder="VD: -1, 1, 2"
                  {...register("floorLevel", { valueAsNumber: true })}
                />
                {errors.floorLevel && <p className="text-sm text-destructive">{errors.floorLevel.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="capacity" className="text-sm font-medium leading-none">
                  Sức chứa (ô đỗ xe) <span className="text-destructive">*</span>
                </label>
                <input
                  id="capacity"
                  type="number"
                  min="1"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    errors.capacity && "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder="VD: 50"
                  {...register("capacity", { valueAsNumber: true })}
                />
                {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="buildingId" className="text-sm font-medium leading-none">
                Tòa nhà <span className="text-destructive">*</span>
              </label>
              <select
                id="buildingId"
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  errors.buildingId && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("buildingId", { valueAsNumber: true })}
              >
                <option value={0} disabled>-- Chọn tòa nhà --</option>
                {buildings.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.buildingName}</option>
                ))}
              </select>
              {errors.buildingId && <p className="text-sm text-destructive">{errors.buildingId.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="vehicleTypeId" className="text-sm font-medium leading-none">
                Loại phương tiện <span className="text-destructive">*</span>
              </label>
              <select
                id="vehicleTypeId"
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  errors.vehicleTypeId && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("vehicleTypeId", { valueAsNumber: true })}
              >
                <option value={0} disabled>-- Chọn loại phương tiện --</option>
                {vehicleTypes?.map((vt: any) => (
                  <option key={vt.id} value={vt.id}>{vt.typeName}</option>
                ))}
              </select>
              {errors.vehicleTypeId && <p className="text-sm text-destructive">{errors.vehicleTypeId.message}</p>}
            </div>

          </FormFields>

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
  );
}
