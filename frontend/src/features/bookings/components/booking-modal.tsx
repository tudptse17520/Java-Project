"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Building2, Layers, Car, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { useAuthStore } from "@/stores/auth.store";
import { useUserVehicles } from "@/features/vehicles/hooks/use-user-vehicles";
import { useBrowseBuildings } from "@/features/browse-building/hooks/use-browse-buildings";
import { useBuildingDetail } from "@/features/browse-building/hooks/use-building-detail";
import { slotService } from "@/services/slot.service";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormValues) => void;
  isLoading?: boolean;
  initialBuildingId?: number;
}

export function BookingModal({
  open,
  onClose,
  onSubmit,
  isLoading,
  initialBuildingId,
}: BookingModalProps) {
  const { user } = useAuthStore();
  const { data: vehicles, isLoading: isVehiclesLoading } = useUserVehicles(user?.id);
  const { data: buildings, isLoading: isBuildingsLoading } = useBrowseBuildings();

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | undefined>(initialBuildingId);
  const [selectedFloorId, setSelectedFloorId] = useState<number | undefined>(undefined);

  const { data: buildingDetail, isLoading: isBuildingLoading } = useBuildingDetail(selectedBuildingId || null);
  
  const { data: slotsData, isLoading: isSlotsLoading } = useQuery({
    queryKey: ["slots", selectedFloorId, "AVAILABLE"],
    queryFn: () => slotService.getSlots(selectedFloorId, "AVAILABLE"),
    enabled: !!selectedFloorId,
  });

  const slots = slotsData?.data || [];

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
      setSelectedBuildingId(initialBuildingId);
      setSelectedFloorId(undefined);
      reset({
        vehicleId: 0,
        parkingSlotId: 0,
        expectedTimeIn: "",
        expectedTimeOut: "",
      });
    }
  }, [open, reset, initialBuildingId]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border bg-background shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <FormContainer onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            <FormHeader
              title="Đặt chỗ trước"
              description="Chọn bãi đỗ, vị trí và thời gian để giữ chỗ cho xe của bạn."
            />

            <FormFields className="grid gap-6 mt-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Chọn Xe */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" /> Xe của bạn <span className="text-destructive">*</span>
                  </label>
                  <select
                    className={cn(
                      "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      errors.vehicleId && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("vehicleId", { valueAsNumber: true })}
                    disabled={isVehiclesLoading || !vehicles?.length}
                  >
                    <option value="0" disabled>
                      {isVehiclesLoading ? "Đang tải xe..." : vehicles?.length ? "-- Chọn phương tiện --" : "Bạn chưa có xe nào"}
                    </option>
                    {vehicles?.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.plate} - {v.brand || v.vehicleTypeName || "Không xác định"}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && <p className="text-sm text-destructive">{errors.vehicleId.message}</p>}
                </div>

                {/* Chọn Tòa Nhà */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Tòa nhà
                  </label>
                  <select
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedBuildingId || 0}
                    onChange={(e) => {
                      setSelectedBuildingId(Number(e.target.value));
                      setSelectedFloorId(undefined);
                    }}
                    disabled={isBuildingsLoading}
                  >
                    <option value="0" disabled>-- Chọn bãi đỗ xe --</option>
                    {buildings?.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.buildingName || b.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Chọn Tầng */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Khu vực / Tầng
                  </label>
                  <select
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedFloorId || 0}
                    onChange={(e) => setSelectedFloorId(Number(e.target.value))}
                    disabled={!selectedBuildingId || isBuildingLoading || !buildingDetail?.floors?.length}
                  >
                    <option value="0" disabled>
                      {!selectedBuildingId ? "Vui lòng chọn tòa nhà trước" : 
                       isBuildingLoading ? "Đang tải tầng..." : 
                       buildingDetail?.floors?.length ? "-- Chọn tầng --" : "Không có dữ liệu tầng"}
                    </option>
                    {buildingDetail?.floors?.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.floorName} (Còn {f.availableSlots || 0} chỗ)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chọn Vị trí (Slot) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Vị trí đỗ (Slot) <span className="text-destructive">*</span>
                  </label>
                  <select
                    className={cn(
                      "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      errors.parkingSlotId && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("parkingSlotId", { valueAsNumber: true })}
                    disabled={!selectedFloorId || isSlotsLoading || !slots.length}
                  >
                    <option value="0" disabled>
                      {!selectedFloorId ? "Vui lòng chọn tầng trước" : 
                       isSlotsLoading ? "Đang tải vị trí trống..." : 
                       slots.length ? "-- Chọn vị trí --" : "Hết chỗ trống"}
                    </option>
                    {slots.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.slotName}
                      </option>
                    ))}
                  </select>
                  {errors.parkingSlotId && <p className="text-sm text-destructive">{errors.parkingSlotId.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg bg-muted/30 border border-muted">
                {/* Thời gian dự kiến vào */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Thời gian dự kiến vào <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className={cn(
                      "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      errors.expectedTimeIn && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("expectedTimeIn")}
                  />
                  {errors.expectedTimeIn && (
                    <p className="text-sm text-destructive">{errors.expectedTimeIn.message}</p>
                  )}
                </div>

                {/* Thời gian dự kiến ra */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Thời gian dự kiến ra <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className={cn(
                      "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      errors.expectedTimeOut && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("expectedTimeOut")}
                  />
                  {errors.expectedTimeOut && (
                    <p className="text-sm text-destructive">{errors.expectedTimeOut.message}</p>
                  )}
                </div>
              </div>

            </FormFields>

            <FormActions className="mt-8 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="h-11 px-8 rounded-lg">
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-lg shadow-sm">
                {isLoading ? "Đang xử lý..." : "Xác nhận Đặt chỗ"}
              </Button>
            </FormActions>
          </FormContainer>
        </div>
      </div>
    </Portal>
  );
}
