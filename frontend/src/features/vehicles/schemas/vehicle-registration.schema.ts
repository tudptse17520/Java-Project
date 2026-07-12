import { z } from "zod";

export const vehicleRegistrationSchema = z.object({
  vehicleTypeId: z.number({ message: "Vui lòng chọn loại xe" }).min(1, "Vui lòng chọn loại xe"),
  plate: z.string().min(1, "Biển số xe không được để trống"),
  brand: z.string().optional(),
  color: z.string().optional(),
});

export type VehicleRegistrationFormValues = z.infer<typeof vehicleRegistrationSchema>;
