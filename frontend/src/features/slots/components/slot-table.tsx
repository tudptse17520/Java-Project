/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { SlotStatusBadge } from "./slot-status-badge";
import { ParkingSlot } from "../types/slot.type";
import { Pencil, Trash2, Eye } from "lucide-react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SlotFormDialog } from "./slot-form-dialog";
import { SlotDetailDialog } from "./slot-detail-dialog";
import { useUpdateSlot, useDeleteSlot } from "../hooks/use-slots";
import { SlotFormValues } from "../schemas/slot.schema";

interface SlotTableProps {
  data: ParkingSlot[];
  isLoading?: boolean;
}

export function SlotTable({ data, isLoading }: SlotTableProps) {
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: updateSlot, isPending: isUpdating } = useUpdateSlot();
  const { mutate: deleteSlot, isPending: isDeleting } = useDeleteSlot();

  const handleEditSubmit = (formData: SlotFormValues) => {
    if (!selectedSlot) return;
    updateSlot(
      { id: selectedSlot.id, data: formData },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setSelectedSlot(null);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!selectedSlot) return;
    deleteSlot(selectedSlot.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedSlot(null);
      }
    });
  };

  const columns = useMemo<ColumnDef<ParkingSlot>[]>(
    () => [
      {
        accessorKey: "slotName",
        header: "Tên vị trí",
        cell: ({ row }) => <span className="font-semibold">{row.original.slotName}</span>,
      },
      {
        accessorKey: "floorName",
        header: "Tầng",
        cell: ({ row }) => {
           return (
             <span className="text-muted-foreground">
               {row.original.floorName || "Hầm B1"}
             </span>
           );
        }
      },
      {
        accessorKey: "vehicleTypeName",
        header: "Loại xe",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.vehicleTypeName || "Ô tô"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <SlotStatusBadge slotId={row.original.id} status={row.original.status} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Thao tác</div>,
        cell: ({ row }) => {
          const slot = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                title="Chi tiết"
                className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                onClick={() => {
                  setSelectedSlot(slot);
                  setIsDetailOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Sửa"
                className="h-8 w-8 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
                onClick={() => {
                  setSelectedSlot(slot);
                  setIsEditOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Xóa"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                onClick={() => {
                  setSelectedSlot(slot);
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <DataTable columns={columns} data={data} isLoading={isLoading} />
      
      <SlotDetailDialog
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSlot(null);
        }}
        data={selectedSlot}
      />

      {isEditOpen && selectedSlot && (
        <SlotFormDialog
          open={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedSlot(null);
          }}
          onSubmit={handleEditSubmit}
          isLoading={isUpdating}
          initialData={selectedSlot}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedSlot(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xóa vị trí đỗ"
        description={`Bạn có chắc chắn muốn xóa vị trí đỗ "${selectedSlot?.slotName}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
