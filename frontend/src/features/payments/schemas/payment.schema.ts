// ---------------------------------------------
// Payment Schema
// Zod validation cho form tạo thanh toán & cập nhật thủ công
// ---------------------------------------------

import { z } from "zod";

/**
 * Schema validate form tạo thanh toán mới.
 * Ràng buộc nghiệp vụ: phải có ít nhất 1 trong 2 trường
 * parkingSessionId hoặc bookingId.
 */
export const createPaymentSchema = z
  .object({
    plate: z.string().optional(),
    parkingSessionId: z
      .union([z.number().int().positive(), z.nan()])
      .nullable(),
    bookingId: z
      .union([z.number().int().positive(), z.nan()])
      .nullable(),
    amount: z
      .number({ message: "Số tiền không được để trống." })
      .min(1000, "Số tiền tối thiểu là 1.000đ."),
    paymentMethod: z
      .string()
      .min(1, "Phương thức thanh toán không được để trống."),
    feeType: z.string().min(1, "Loại phí không được để trống."),
  })
  .refine(
    (data) => data.parkingSessionId != null || data.bookingId != null,
    {
      message:
        "Bắt buộc phải nhập Mã lượt gửi xe hoặc Mã đặt chỗ (ít nhất 1 trong 2).",
      path: ["parkingSessionId"],
    }
  );

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;

/**
 * Schema validate form Staff cập nhật trạng thái thủ công.
 * - status: chỉ SUCCESS hoặc FAILED.
 * - note: bắt buộc, tối thiểu 10 ký tự (để đối soát kiểm toán).
 */
export const manualStatusSchema = z.object({
  status: z.enum(["SUCCESS", "FAILED"], {
    message: "Trạng thái phải là Thành công hoặc Thất bại.",
  }),
  note: z
    .string()
    .min(1, "Lý do không được để trống.")
    .min(10, "Lý do phải có tối thiểu 10 ký tự."),
});

export type ManualStatusFormValues = z.infer<typeof manualStatusSchema>;
