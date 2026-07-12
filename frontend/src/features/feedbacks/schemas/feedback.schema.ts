import * as z from "zod";

export const feedbackFormSchema = z.object({
  parkingSessionId: z.number().min(1, { message: "Vui lòng nhập ID lượt gửi xe" }),
  issueType: z.enum(["LOST_TICKET", "WRONG_PLATE", "OVERTIME", "WRONG_PLACE", "UNPAID_EXIT"]),
  description: z.string().min(1, { message: "Vui lòng nhập mô tả sự cố" }),
  status: z.enum(["REPORTED", "PROCESSING", "RESOLVED"]),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
