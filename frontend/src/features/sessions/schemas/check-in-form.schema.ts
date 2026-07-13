import { z } from 'zod';

export const checkInSchema = z.object({
  plate: z.string().min(1, { message: 'Biển số xe không được để trống' }),
  vehicleId: z.number().nullable().optional(),
  parkingSlotId: z.number().nullable().optional(),
});

export type CheckInFormValues = z.infer<typeof checkInSchema>;

export const sessionUpdateSchema = z.object({
  plate: z.string().min(1, { message: 'Biển số xe không được để trống' }),
  vehicleId: z.number().nullable().optional(),
  parkingSlotId: z.number().nullable().optional(),
});

export type SessionUpdateFormValues = z.infer<typeof sessionUpdateSchema>;
