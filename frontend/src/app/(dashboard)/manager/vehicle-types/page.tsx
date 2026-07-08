"use client";

import { Plus } from "lucide-react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { VehicleTypeTable } from "@/features/vehicle-types/components/vehicle-type-table";
import { VehicleTypeFormDialog } from "@/features/vehicle-types/components/vehicle-type-form-dialog";
import { useVehicleTypes } from "@/features/vehicle-types/hooks/use-vehicle-types";
import { useVehicleTypeActions } from "@/features/vehicle-types/hooks/use-vehicle-type-actions";

export default function VehicleTypesPage() {
  const { data: vehicleTypes = [], isLoading: isFetching } = useVehicleTypes();

  const {
    isFormOpen,
    selectedVehicleType,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormSubmit,
    isConfirmOpen,
    vehicleTypeToDeactivate,
    isDeactivating,
    handleOpenDeactivate,
    handleCloseConfirm,
    handleConfirmDeactivate,
  } = useVehicleTypeActions();

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý Loại Phương Tiện"
        description="Xem danh sách, thêm mới và thiết lập các loại phương tiện được phép gửi trong bãi."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        }
      />

      <VehicleTypeTable
        data={vehicleTypes}
        isLoading={isFetching}
        onEdit={handleOpenEdit}
        onDeactivate={handleOpenDeactivate}
      />

      <VehicleTypeFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={selectedVehicleType}
        isLoading={isMutating}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDeactivate}
        title="Ngừng áp dụng loại xe"
        description={`Bạn có chắc chắn muốn ngừng áp dụng "${vehicleTypeToDeactivate?.type_name}"? Các đơn giá liên quan đến loại xe này có thể bị ảnh hưởng.`}
        confirmText="Ngừng áp dụng"
        isLoading={isDeactivating}
      />
    </PageContainer>
  );
}
