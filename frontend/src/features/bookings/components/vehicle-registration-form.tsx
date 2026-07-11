'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleRegistrationSchema, VehicleRegistrationFormValues } from '../schemas/vehicle.schema';
import { useVehicleRegistration } from '../hooks/use-vehicle-registration';

export const VehicleRegistrationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleRegistrationFormValues>({
    resolver: zodResolver(vehicleRegistrationSchema),
  });

  const { mutate, isPending } = useVehicleRegistration();

  const onSubmit = (data: VehicleRegistrationFormValues) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form Fields áp dụng quy chuẩn UI */}
      <div>
        <label className="text-sm font-medium">Biển số xe <span className="text-red-500">*</span></label>
        <input {...register('licensePlate')} className="border p-2 w-full" />
        {errors.licensePlate && <p className="text-red-500 text-sm">{errors.licensePlate.message}</p>}
      </div>
      
      {/* Các field khác tương tự... */}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Hủy</Button>
        <Button type="submit" disabled={isPending}>
            {isPending ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>
    </div>
    </form>
  );
};