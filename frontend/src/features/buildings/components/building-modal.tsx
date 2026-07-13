/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { FormContainer, FormHeader, FormFields, FormActions } from '@/components/common/form-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BuildingStatus } from '@/constants/building-status';
import { buildingCreateSchema, buildingUpdateSchema, type BuildingCreateForm, type BuildingUpdateForm } from '../schemas/building-form.schema';
import type { BuildingResponse } from '@/types/building.type';
import { X } from 'lucide-react';
import { useCreateBuilding, useUpdateBuilding } from '../hooks/use-buildings';
import { Portal } from '@/components/common/portal';

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
      status: BuildingStatus.ACTIVE,
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
          status: BuildingStatus.ACTIVE,
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
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-backdrop" 
          onClick={onClose} 
          aria-hidden="true" 
        />

        {/* Modal Content */}
        <div className="relative z-50 w-full max-w-md rounded-xl border border-border/60 bg-background p-6 shadow-xl animate-scale-in">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200"
            type="button"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng</span>
          </button>

          <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
            <FormHeader 
              title={isEditMode ? 'Cập nhật Tòa Nhà' : 'Thêm Tòa Nhà Mới'} 
              description={isEditMode ? 'Thay đổi thông tin của tòa nhà hiện tại.' : 'Nhập thông tin cho tòa nhà mới.'}
            />

            <FormFields>
              <div className="space-y-1.5">
                <Label htmlFor="buildingName">
                  Tên Tòa Nhà <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="buildingName"
                  {...form.register('buildingName')}
                  className={cn(form.formState.errors.buildingName && 'border-destructive focus-visible:ring-destructive/30')}
                  placeholder="Nhập tên tòa nhà"
                  disabled={isPending}
                />
                {form.formState.errors.buildingName && (
                  <p className="text-xs text-destructive">{form.formState.errors.buildingName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="numberOfFloors">
                  Số Tầng <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="numberOfFloors"
                  type="number"
                  {...form.register('numberOfFloors', { valueAsNumber: true })}
                  className={cn(form.formState.errors.numberOfFloors && 'border-destructive focus-visible:ring-destructive/30')}
                  placeholder="Nhập số tầng"
                  disabled={isPending}
                />
                {form.formState.errors.numberOfFloors && (
                  <p className="text-xs text-destructive">{form.formState.errors.numberOfFloors.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">
                  Địa Chỉ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  {...form.register('address')}
                  className={cn(form.formState.errors.address && 'border-destructive focus-visible:ring-destructive/30')}
                  placeholder="Nhập địa chỉ"
                  disabled={isPending}
                />
                {form.formState.errors.address && (
                  <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">
                  Trạng Thái <span className="text-destructive">*</span>
                </Label>
                <select
                  id="status"
                  {...form.register('status')}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm transition-colors duration-200 hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending}
                >
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                  <option value="INACTIVE">Ngừng hoạt động</option>
                </select>
                {form.formState.errors.status && (
                  <p className="text-xs text-destructive">{form.formState.errors.status.message}</p>
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
    </Portal>
  );
}
