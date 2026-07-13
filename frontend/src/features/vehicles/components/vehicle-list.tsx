import React from "react";
import { Car, Bike, Plus } from "lucide-react";
import { useUserVehicles } from "../hooks/use-user-vehicles";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface VehicleListProps {
  onAddClick: () => void;
}

export function VehicleList({ onAddClick }: VehicleListProps) {
  const { user } = useAuthStore();
  const { data: vehicles, isLoading, isError } = useUserVehicles(user?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner text="Đang tải danh sách phương tiện..." />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Lỗi tải dữ liệu"
        description="Không thể tải danh sách phương tiện. Vui lòng thử lại sau."
      />
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <EmptyState
        title="Chưa có phương tiện"
        description="Bạn chưa đăng ký phương tiện nào. Vui lòng thêm phương tiện mới để sử dụng dịch vụ đặt chỗ."
        action={
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Đăng ký xe mới
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => {
        // Assume vehicle type ID 1 or name containing "ô tô" is Car, else Bike.
        const isCar = vehicle.vehicleTypeName?.toLowerCase().includes("ô tô") || vehicle.vehicleTypeId === 1;

        return (
          <div
            key={vehicle.id}
            className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-primary">
                <div className="rounded-full bg-primary/10 p-2.5">
                  {isCar ? <Car className="h-5 w-5" /> : <Bike className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold">{vehicle.vehicleTypeName || "Phương tiện"}</h3>
                  <p className="text-sm text-muted-foreground">{isCar ? "Ô tô" : "Xe máy"}</p>
                </div>
              </div>
              <div className="rounded border bg-muted/50 px-3 py-1 font-mono text-lg font-bold tracking-widest text-foreground">
                {vehicle.plate}
              </div>
            </div>

            {(vehicle.brand || vehicle.color) && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground border-t pt-4">
                {vehicle.brand && (
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider">Hãng xe</span>
                    <span className="font-medium text-foreground">{vehicle.brand}</span>
                  </div>
                )}
                {vehicle.color && (
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider">Màu sắc</span>
                    <span className="font-medium text-foreground">{vehicle.color}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
