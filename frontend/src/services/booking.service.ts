import  axiosClient  from '@/lib/axios-client';
import { BookingResponse } from '@/features/bookings/types/booking.type';

export const bookingService = {
  getAll: () => axiosClient.get<BookingResponse>('/bookings'),
};