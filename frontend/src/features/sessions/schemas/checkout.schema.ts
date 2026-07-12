import * as z from "zod";

export const searchSessionSchema = z.object({
  plate: z.string().min(1, "Vui lòng nhập biển số xe"),
});

export type SearchSessionFormValues = z.infer<typeof searchSessionSchema>;

export const overrideCheckoutSchema = z.object({
  overrideReason: z.string().min(5, "Lý do phải có ít nhất 5 ký tự"),
});

export type OverrideCheckoutFormValues = z.infer<typeof overrideCheckoutSchema>;

export const lostTicketSchema = z.object({
  note: z.string().min(5, "Ghi chú phải có ít nhất 5 ký tự"),
});

export type LostTicketFormValues = z.infer<typeof lostTicketSchema>;

export const validatePlateSchema = z.object({
  plateOut: z.string().min(1, "Vui lòng nhập biển số xe lúc ra"),
  plateOutImage: z.string().optional(),
});

export type ValidatePlateFormValues = z.infer<typeof validatePlateSchema>;
