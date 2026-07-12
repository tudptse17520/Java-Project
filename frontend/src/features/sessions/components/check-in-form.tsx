import React from 'react';
import { FormContainer } from '@/components/common/form-container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkInSchema, CheckInFormValues } from '../schemas/check-in-form.schema';
import { useCheckInVehicle } from '../hooks/use-sessions';

interface CheckInFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CheckInForm = ({ onSuccess, onCancel }: CheckInFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      plate: '',
      vehicleId: undefined,
      parkingSlotId: undefined,
    }
  });

  const checkInMutation = useCheckInVehicle();

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
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
            {errors.vehicleId && (
              <p className="text-sm text-red-500 mt-1">{errors.vehicleId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vị trí đỗ đặt trước (Tùy chọn)</label>
            <Input type="number" {...register('parkingSlotId', { valueAsNumber: true })} placeholder="ID vị trí đỗ" />
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
    </form>
  );
};
