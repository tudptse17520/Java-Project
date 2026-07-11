"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormContainer, FormHeader, FormFields, FormActions } from '@/components/common/form-container';
import { Button } from '@/components/ui/button';
import { buildingCreateSchema, buildingUpdateSchema, type BuildingCreateForm, type BuildingUpdateForm } from '../schemas/building-form.schema';
import type { BuildingResponse } from '@/types/building.type';
import { X } from 'lucide-react';
import { useCreateBuilding, useUpdateBuilding } from '../hooks/use-buildings';

interface BuildingModalProps {
  open: boolean;
  onClose: () => void;
  building?: BuildingResponse | null;
}

export function BuildingModal({ open, onClose, building }: BuildingModalProps) {
  const isEditMode = !!building;
  
  const { mutate: createBuilding, isPending: isCreating } = useCreateBuilding();
  const { mutate: updateBuilding, isPending: isUpdating } = useUpdateBuilding();
  const isPending = isCreating || isUpdating;

  const form = useForm<BuildingCreateForm | BuildingUpdateForm>({
    resolver: zodResolver(isEditMode ? buildingUpdateSchema as any : buildingCreateSchema as any),
    defaultValues: {
      buildingName: '',
      address: '',
      numberOfFloors: 1,
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (open) {
      if (building) {
        form.reset({
          buildingName: building.buildingName,
          address: building.address,
          numberOfFloors: building.numberOfFloors,
          status: building.status,
        });
      } else {
        form.reset({
          buildingName: '',
          address: '',
          numberOfFloors: 1,
          status: 'ACTIVE',
        });
      }
    }
  }, [open, building, form]);

  const onSubmit = (data: BuildingCreateForm | BuildingUpdateForm) => {
    if (isEditMode && building) {
      updateBuilding(
        { id: building.id, data: data as BuildingUpdateForm },
        { onSuccess: onClose }
      );
    } else {
      createBuilding(
        data as BuildingCreateForm,
        { onSuccess: onClose }
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          type="button"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Đóng</span>
        </button>

        <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
          <FormHeader 
            title={isEditMode ? 'Cập nhật Tòa Nhà' : 'Thêm Tòa Nhà Mới'} 
            description={isEditMode ? 'Thay đổi thông tin của tòa nhà hiện tại.' : 'Nhập thông tin cho tòa nhà mới.'}
          />

          <FormFields>
            <div className="space-y-2">
              <label htmlFor="buildingName" className="text-sm font-medium">
                Tên Tòa Nhà <span className="text-red-500">*</span>
              </label>
              <input
                id="buildingName"
                {...form.register('buildingName')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nhập tên tòa nhà"
                disabled={isPending}
              />
              {form.formState.errors.buildingName && (
                <p className="text-xs text-red-500">{form.formState.errors.buildingName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="numberOfFloors" className="text-sm font-medium">
                Số Tầng <span className="text-red-500">*</span>
              </label>
              <input
                id="numberOfFloors"
                type="number"
                {...form.register('numberOfFloors', { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nhập số tầng"
                disabled={isPending}
              />
              {form.formState.errors.numberOfFloors && (
                <p className="text-xs text-red-500">{form.formState.errors.numberOfFloors.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Địa Chỉ <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                {...form.register('address')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nhập địa chỉ"
                disabled={isPending}
              />
              {form.formState.errors.address && (
                <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Trạng Thái <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...form.register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="MAINTENANCE">Bảo trì</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
              {form.formState.errors.status && (
                <p className="text-xs text-red-500">{form.formState.errors.status.message}</p>
              )}
            </div>
          </FormFields>

          <FormActions>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
