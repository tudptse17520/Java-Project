import { z } from 'zod';
import { SlotStatus } from '@/constants/slot-status';

export const slotSchema = z.object({
  floorId: z.coerce.number().min(1, "Vui lòng chọn tầng"),
  slotName: z.string().min(1, "Tên vị trí không được để trống"),
  status: z.nativeEnum(SlotStatus),
});

export type SlotFormValues = z.infer<typeof slotSchema>;