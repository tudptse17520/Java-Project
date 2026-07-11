import { z } from "zod";

export const floorSchema = z.object({
  floorName: z.string().min(1, "Tên tầng không được để trống"),
  floorLevel: z.coerce.number(),
  capacity: z.coerce.number().min(1, "Sức chứa phải lớn hơn 0"),
  buildingId: z.coerce.number().min(1, "Vui lòng chọn tòa nhà"),
  vehicleTypeId: z.coerce.number().min(1, "Vui lòng chọn loại xe"),
});

export type FloorFormValues = z.infer<typeof floorSchema>;
