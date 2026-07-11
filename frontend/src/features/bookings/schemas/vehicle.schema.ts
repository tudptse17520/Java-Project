import { z } from 'zod';

export const vehicleRegistrationSchema = z.object({
  licensePlate: z.string().min(1, 'Biển số xe bắt buộc'),
  brand: z.string().min(1, 'Thương hiệu bắt buộc'),
  model: z.string().min(1, 'Dòng xe bắt buộc'),
  color: z.string().min(1, 'Màu xe bắt buộc'),
});

export type VehicleRegistrationFormValues = z.infer<typeof vehicleRegistrationSchema>;