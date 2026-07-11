// ---------------------------------------------
// User Form Schemas
// Zod validation schemas khớp backend validation constraints
// ---------------------------------------------

import { z } from "zod";

export const userCreateSchema = z.object({
  username: z
    .string()
    .min(1, "Tên đăng nhập không được để trống.")
    .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự."),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống.")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  fullName: z
    .string()
    .min(1, "Họ tên không được để trống."),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại không được để trống.")
    .regex(
      /^(0[3|5|7|8|9])+([0-9]{8})$/,
      "Số điện thoại không đúng định dạng."
    ),
  role: z
    .string()
    .min(1, "Vai trò không được để trống."),
});

export const userUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ tên không được để trống."),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại không được để trống.")
    .regex(
      /^(0[3|5|7|8|9])+([0-9]{8})$/,
      "Số điện thoại không đúng định dạng."
    ),
  role: z
    .string()
    .min(1, "Vai trò không được để trống."),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
