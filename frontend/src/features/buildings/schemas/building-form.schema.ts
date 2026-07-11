import { z } from 'zod';

export const buildingCreateSchema = z.object({
  buildingName: z.string().min(3, { message: 'Tên tòa nhà phải có ít nhất 3 ký tự' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
    required_error: 'Trạng thái không được để trống',
  }),
});

export const buildingUpdateSchema = z.object({
  buildingName: z.string().min(3, { message: 'Tên tòa nhà phải có ít nhất 3 ký tự' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
    required_error: 'Trạng thái không được để trống',
  }),
});

export type BuildingCreateForm = z.infer<typeof buildingCreateSchema>;
export type BuildingUpdateForm = z.infer<typeof buildingUpdateSchema>;
