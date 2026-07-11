import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await bookingService.getAll();
      return response.data;
    },
  });
};