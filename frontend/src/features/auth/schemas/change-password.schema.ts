import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Mật khẩu cũ không được để trống"),
  newPassword: z
    .string()
    .min(6, "Mật khẩu mới phải từ 6 đến 50 ký tự")
    .max(50, "Mật khẩu mới phải từ 6 đến 50 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
