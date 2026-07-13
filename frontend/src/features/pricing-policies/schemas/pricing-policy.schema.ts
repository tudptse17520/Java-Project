// ---------------------------------------------
// Pricing Policy Schema
// Zod validation cho form thêm / cập nhật bảng giá
// ---------------------------------------------

import { z } from "zod";

export const pricingPolicySchema = z.object({
  vehicleTypeId: z
    .number({ error: "Vui lòng chọn loại phương tiện." })
    .min(1, "Vui lòng chọn loại phương tiện."),

  basePrice: z
    .number({ error: "Giá cơ bản không được để trống." })
    .min(0, "Giá cơ bản phải lớn hơn hoặc bằng 0."),

  extraFeePerHour: z
    .number({ error: "Phí phụ thu không được để trống." })
    .min(0, "Phí phụ thu phải lớn hơn hoặc bằng 0."),

  effectiveDate: z
    .string({ error: "Ngày hiệu lực không được để trống." })
    .min(1, "Ngày hiệu lực không được để trống."),
});

export type PricingPolicyFormValues = z.infer<typeof pricingPolicySchema>;
