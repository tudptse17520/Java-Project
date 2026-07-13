"use client";

import React, { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/data-table';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { BuildingStatusBadge } from './building-status-badge';
import type { BuildingResponse } from '@/types/building.type';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useUpdateBuildingStatus } from '../hooks/use-buildings';

interface BuildingTableProps {
  buildings: BuildingResponse[];
  onEdit: (building: BuildingResponse) => void;
  isLoading?: boolean;
}

export function BuildingTable({ buildings, onEdit, isLoading }: BuildingTableProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse | null>(null);

  const { mutate: updateBuildingStatus, isPending: isUpdating } = useUpdateBuildingStatus();

  const handleDeleteClick = (building: BuildingResponse) => {
    setSelectedBuilding(building);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBuilding) return;
    
    updateBuildingStatus({
      id: selectedBuilding.id,
      status: 'INACTIVE',
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
      accessorKey: 'buildingName',
      header: 'Tên Tòa Nhà',
    },
    {
      accessorKey: 'address',
      header: 'Địa Chỉ',
      cell: ({ row }) => (
        <div 
          className="truncate max-w-[200px] text-muted-foreground hover:text-foreground transition-colors cursor-default" 
          title={row.original.address}
        >
          {row.original.address}
        </div>
      )
    },
    {
      accessorKey: 'numberOfFloors',
      header: 'Số Tầng',
      cell: ({ row }) => (
        <Link 
          href={`/manager/floors?buildingId=${row.original.id}`}
          className="text-primary hover:underline font-medium inline-flex items-center gap-1"
        >
          {row.original.numberOfFloors} tầng <span className="text-xs">→</span>
        </Link>
      )
    },
    {
      accessorKey: 'totalAvailableSlots',
      header: 'Số Chỗ Trống',
      cell: ({ row }) => {
        const slots = row.original.totalAvailableSlots;
        return (
          <div className="font-medium">
            {slots != null ? (
              <span className="text-emerald-600 dark:text-emerald-400">{slots} trống</span>
            ) : (
              <span className="text-muted-foreground/50 italic">Đang cập nhật</span>
            )}
          </div>
        );
      }
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
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDeleteClick(row.original)}
            title="Ngừng hoạt động"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4" />
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
        description={`Bạn có chắc chắn muốn chuyển trạng thái tòa nhà ${selectedBuilding?.buildingName} sang Ngừng hoạt động?`}
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  );
}
