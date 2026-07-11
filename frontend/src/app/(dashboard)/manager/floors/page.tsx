"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useFloors, useCreateFloor, useUpdateFloor, useDeleteFloor } from "@/features/floors/hooks/use-floors";
import { FloorTable } from "@/features/floors/components/floor-table";
import { FloorFormDialog } from "@/features/floors/components/floor-form-dialog";
import { Floor } from "@/features/floors/types/floor.type";
import type { FloorFormValues } from "@/features/floors/schemas/floor.schema";

export default function FloorsPage() {
  const { data: floors = [], isLoading } = useFloors();
  const createMutation = useCreateFloor();
  const updateMutation = useUpdateFloor();
  const deleteMutation = useDeleteFloor();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [floorToDelete, setFloorToDelete] = useState<Floor | null>(null);

  const handleOpenCreate = () => {
    setSelectedFloor(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (floor: Floor) => {
    setSelectedFloor(floor);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (floor: Floor) => {
    setFloorToDelete(floor);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (values: FloorFormValues) => {
    if (selectedFloor) {
      updateMutation.mutate(
        { id: selectedFloor.id, data: values },
        {
          onSuccess: () => {
            setIsFormOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (floorToDelete) {
      deleteMutation.mutate(floorToDelete.id, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setFloorToDelete(null);
        },
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý tầng đỗ xe"
        description="Xem và quản lý danh sách các tầng trong bãi đỗ xe."
        action={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tầng đỗ xe
          </Button>
        }
      />

      <div className="mt-6">
        <FloorTable
          data={floors}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

      <FloorFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedFloor}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xóa tầng đỗ xe"
        description={`Bạn có chắc chắn muốn xóa tầng "${floorToDelete?.floor_name}" không? Thao tác này không thể hoàn tác và sẽ chuyển tầng sang trạng thái LOCKED.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
