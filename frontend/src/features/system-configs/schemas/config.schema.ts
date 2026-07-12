import * as z from "zod";

export const systemConfigSchema = z.object({
  configValue: z.string()
    .min(1, "Giá trị cấu hình không được để trống")
    .max(255, "Giá trị cấu hình không vượt quá 255 ký tự"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

export type SystemConfigFormValues = z.infer<typeof systemConfigSchema>;
