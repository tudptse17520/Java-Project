import { z } from 'zod';

export const buildingCreateSchema = z.object({
  buildingName: z.string().min(3, { message: 'Tên tòa nhà phải có ít nhất 3 ký tự' }).max(100, { message: 'Tên tòa nhà không vượt quá 100 ký tự' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }).max(255, { message: 'Địa chỉ không vượt quá 255 ký tự' }),
  numberOfFloors: z.coerce.number().min(1, { message: 'Số tầng phải lớn hơn hoặc bằng 1' }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
    message: 'Trạng thái không được để trống',
  }),
});

export const buildingUpdateSchema = z.object({
  buildingName: z.string().min(3, { message: 'Tên tòa nhà phải có ít nhất 3 ký tự' }).max(100, { message: 'Tên tòa nhà không vượt quá 100 ký tự' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }).max(255, { message: 'Địa chỉ không vượt quá 255 ký tự' }),
  numberOfFloors: z.coerce.number().min(1, { message: 'Số tầng phải lớn hơn hoặc bằng 1' }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
    message: 'Trạng thái không được để trống',
  }),
});

export interface BuildingCreateForm {
  buildingName: string;
  address: string;
  numberOfFloors: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export interface BuildingUpdateForm {
  buildingName: string;
  address: string;
  numberOfFloors: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}
