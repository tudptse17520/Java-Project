"use client";

import React, { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/data-table';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { BuildingStatusBadge } from './building-status-badge';
import type { BuildingResponse } from '@/types/building.type';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { useUpdateBuilding } from '../hooks/use-buildings';

interface BuildingTableProps {
  buildings: BuildingResponse[];
  onEdit: (building: BuildingResponse) => void;
  isLoading?: boolean;
}

export function BuildingTable({ buildings, onEdit, isLoading }: BuildingTableProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse | null>(null);

  const { mutate: updateBuilding, isPending: isUpdating } = useUpdateBuilding();

  const handleDeleteClick = (building: BuildingResponse) => {
    setSelectedBuilding(building);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBuilding) return;
    
    updateBuilding({
      id: selectedBuilding.id,
      data: {
        building_name: selectedBuilding.building_name,
        address: selectedBuilding.address,
        number_of_floors: selectedBuilding.number_of_floors,
        status: 'INACTIVE',
      },
    }, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setSelectedBuilding(null);
      }
    });
  };

  const columns: ColumnDef<BuildingResponse>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'building_name',
      header: 'Tên Tòa Nhà',
    },
    {
      accessorKey: 'address',
      header: 'Địa Chỉ',
    },
    {
      accessorKey: 'number_of_floors',
      header: 'Số Tầng',
    },
    {
      accessorKey: 'total_available_slots',
      header: 'Số Chỗ Trống',
    },
    {
      accessorKey: 'status',
      header: 'Trạng Thái',
      cell: ({ row }) => (
        <BuildingStatusBadge status={row.original.status} />
      ),
    },
    {
      id: 'actions',
      header: 'Thao Tác',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            title="Sửa"
          >
            <Edit2 />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => handleDeleteClick(row.original)}
            title="Ngừng hoạt động"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <DataTable
        columns={columns}
        data={buildings}
        isLoading={isLoading}
        className="min-w-[800px]"
      />
      
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Ngừng hoạt động tòa nhà"
        description={`Bạn có chắc chắn muốn chuyển trạng thái tòa nhà ${selectedBuilding?.building_name} sang Ngừng hoạt động?`}
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  );
}
