import { z } from "zod";
import { VehicleTypeStatus } from "@/constants/vehicle-type-status";

export const vehicleTypeSchema = z.object({
  typeName: z
    .string()
    .min(1, { message: "Tên loại phương tiện không được để trống" })
    .max(100, { message: "Tên loại phương tiện không được vượt quá 100 ký tự" }),
  description: z
    .string()
    .max(255, { message: "Mô tả không được vượt quá 255 ký tự" })
    .optional(),
  status: z.nativeEnum(VehicleTypeStatus),
});

export type VehicleTypeFormValues = z.infer<typeof vehicleTypeSchema>;
