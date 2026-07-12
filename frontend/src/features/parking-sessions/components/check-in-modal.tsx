import React from 'react';
import { FormContainer } from '@/components/common/form-container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkInSchema, CheckInFormValues } from '../schemas/check-in-form.schema';
import { useCheckInVehicle } from '../hooks/use-sessions';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal = ({ isOpen, onClose }: CheckInModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      plate: '',
      vehicleId: null,
      parkingSlotId: null,
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
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-lg rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Check-in xe vào bãi</h2>
              <p className="text-sm text-muted-foreground">Nhập thông tin phương tiện để check-in</p>
            </div>
            
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
              <Button type="button" variant="outline" onClick={onClose} disabled={checkInMutation.isPending}>
                Hủy bỏ
              </Button>
              <Button type="submit" variant="default" disabled={checkInMutation.isPending}>
                {checkInMutation.isPending ? 'Đang xử lý...' : 'Check-in'}
              </Button>
            </div>
          </FormContainer>
        </form>
      </div>
    </div>
  );
};
