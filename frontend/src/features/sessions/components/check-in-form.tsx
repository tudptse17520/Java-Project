"use client";

import React from 'react';
import { FormContainer } from '@/components/common/form-container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkInSchema, CheckInFormValues } from '../schemas/check-in-form.schema';
import { useCheckInVehicle } from '../hooks/use-sessions';
import { useSlots } from '@/features/slots/hooks/use-slots';

interface CheckInFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: Partial<CheckInFormValues>;
}

export const CheckInForm = ({ onSuccess, onCancel, defaultValues }: CheckInFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: defaultValues || {
      plate: '',
      vehicleId: undefined,
      parkingSlotId: undefined,
    }
  });

  const checkInMutation = useCheckInVehicle();
  const { data: slotsResponse } = useSlots();
  const slots = slotsResponse?.data || [];

  const onSubmit = (data: CheckInFormValues) => {
    checkInMutation.mutate({
      plate: data.plate,
      vehicleId: data.vehicleId ? Number(data.vehicleId) : null,
      parkingSlotId: data.parkingSlotId ? Number(data.parkingSlotId) : null,
    }, {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Biển số xe <span className="text-red-500">*</span>
          </label>
          <Input {...register('plate')} placeholder="Nhập biển số xe (VD: 51H-12345)" />
          {errors.plate && (
            <p className="text-sm text-red-500 mt-1">{errors.plate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mã xe thành viên (Tùy chọn)</label>
          <Input type="number" {...register('vehicleId', { valueAsNumber: true })} placeholder="ID xe nếu đã đăng ký" />
          <p className="text-xs text-muted-foreground mt-1">
            Nhập ID nếu là xe tháng/xe cư dân đã đăng ký. Bỏ trống nếu là khách vãng lai.
          </p>
          {errors.vehicleId && (
            <p className="text-sm text-red-500 mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vị trí đỗ đặt trước (Tùy chọn)</label>
          <select 
            {...register('parkingSlotId', { valueAsNumber: true })} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">-- Chọn vị trí đỗ (Không bắt buộc) --</option>
            {slots.map((slot: any) => (
              <option key={slot.id} value={slot.id}>
                {slot.slotName} {slot.floorName ? `- ${slot.floorName}` : ''} ({slot.status === 'AVAILABLE' ? 'Trống' : slot.status === 'RESERVED' ? 'Đã đặt' : slot.status})
              </option>
            ))}
          </select>
          {errors.parkingSlotId && (
            <p className="text-sm text-red-500 mt-1">{errors.parkingSlotId.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={checkInMutation.isPending}>
            Hủy bỏ
          </Button>
        ) : (
          <div></div>
        )}
        <Button type="submit" variant="default" disabled={checkInMutation.isPending}>
          {checkInMutation.isPending ? 'Đang xử lý...' : 'Check-in'}
        </Button>
      </div>
    </FormContainer>
  );
};
