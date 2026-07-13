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
import { FloorFilter } from "@/features/floors/components/floor-filter";
import { Toolbar } from "@/components/common/toolbar";
import { Floor } from "@/features/floors/types/floor.type";
import type { FloorFormValues } from "@/features/floors/schemas/floor.schema";

export default function FloorsPage() {
  const [keyword, setKeyword] = useState("");
  const [buildingId, setBuildingId] = useState<string | undefined>(undefined);

  const { data: initialFloors = [], isLoading } = useFloors();
  const createMutation = useCreateFloor();
  const updateMutation = useUpdateFloor();
  const deleteMutation = useDeleteFloor();

  // Áp dụng bộ lọc
  const floors = initialFloors.filter((floor) => {
    const matchesKeyword = floor.floorName.toLowerCase().includes(keyword.toLowerCase());
    const matchesBuilding = buildingId ? floor.buildingId.toString() === buildingId : true;
    return matchesKeyword && matchesBuilding;
  });

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
      deleteMutation.mutate({ id: floorToDelete.id, floorName: floorToDelete.floorName }, {
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
        title="Quản lý tầng" 
        description="Quản lý danh sách các tầng trong bãi đỗ xe"
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tầng đỗ xe
          </Button>
        }
      />

      <Toolbar>
        <FloorFilter 
          keyword={keyword}
          onKeywordChange={setKeyword}
          buildingId={buildingId}
          onBuildingChange={setBuildingId}
        />
      </Toolbar>

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
        description={`Bạn có chắc chắn muốn xóa tầng "${floorToDelete?.floorName}" không? Thao tác này không thể hoàn tác và sẽ chuyển tầng sang trạng thái LOCKED.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
