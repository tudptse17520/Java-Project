import { z } from 'zod';

export const buildingCreateSchema = z.object({
  building_name: z.string().min(3, { message: 'Tên tòa nhà phải có ít nhất 3 ký tự' }).max(100, { message: 'Tên tòa nhà không vượt quá 100 ký tự' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }).max(255, { message: 'Địa chỉ không vượt quá 255 ký tự' }),
  number_of_floors: z.coerce.number().min(1, { message: 'Số tầng phải lớn hơn hoặc bằng 1' }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
    required_error: 'Trạng thái không được để trống',
  }),
});

export const buildingUpdateSchema = z.object({
  building_name: z.string().min(3, { message: 'Tên tòa nhà phải có ít nhất 3 ký tự' }).max(100, { message: 'Tên tòa nhà không vượt quá 100 ký tự' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }).max(255, { message: 'Địa chỉ không vượt quá 255 ký tự' }),
  number_of_floors: z.coerce.number().min(1, { message: 'Số tầng phải lớn hơn hoặc bằng 1' }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
    required_error: 'Trạng thái không được để trống',
  }),
});

export type BuildingCreateForm = z.infer<typeof buildingCreateSchema>;
export type BuildingUpdateForm = z.infer<typeof buildingUpdateSchema>;
