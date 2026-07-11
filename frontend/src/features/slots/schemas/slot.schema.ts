import { z } from 'zod';

export const slotSchema = z.object({
  floorId: z.number().min(1, "Vui lòng chọn tầng"),
  slotName: z.string().min(1, "Tên vị trí không được để trống"),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'LOCKED']),
});