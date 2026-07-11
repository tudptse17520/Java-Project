import { z } from "zod";

export const bookingFormSchema = z.object({
  vehicleId: z.string().min(1, { message: "Vui lòng nhập xe." }),
  parkingSlotId: z.string().min(1, { message: "Vui lòng nhập vị trí đỗ." }),
  expectedTimeIn: z.string().min(1, { message: "Vui lòng chọn thời gian dự kiến vào." }),
  expectedTimeOut: z.string().min(1, { message: "Vui lòng chọn thời gian dự kiến ra." }),
}).refine((data) => {
  const timeIn = new Date(data.expectedTimeIn).getTime();
  const timeOut = new Date(data.expectedTimeOut).getTime();
  return timeOut > timeIn;
}, {
  message: "Thời gian ra phải lớn hơn thời gian vào.",
  path: ["expectedTimeOut"],
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
