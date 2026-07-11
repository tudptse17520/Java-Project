import { z } from "zod";

export const floorSchema = z.object({
  floorName: z.string().min(1, "Tên tầng không được để trống"),
  floorLevel: z.number({ message: "Vui lòng nhập số" }),
  capacity: z.number({ message: "Vui lòng nhập số" }).min(1, "Sức chứa phải lớn hơn 0"),
  buildingId: z.number({ message: "Vui lòng chọn tòa nhà" }).min(1, "Vui lòng chọn tòa nhà"),
  vehicleTypeId: z.number({ message: "Vui lòng chọn loại xe" }).min(1, "Vui lòng chọn loại xe"),
});

export type FloorFormValues = z.infer<typeof floorSchema>;
