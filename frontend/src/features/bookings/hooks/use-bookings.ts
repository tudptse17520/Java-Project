import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
} from "@/services/booking.service";
import type { BookingRequest } from "../types/booking.type";

export const BOOKING_KEYS = {
  all: ["bookings"] as const,
  lists: () => [...BOOKING_KEYS.all, "list"] as const,
  userLists: (userId: number) => [...BOOKING_KEYS.all, "user", userId] as const,
};

export const useUserBookings = (userId: number | undefined) => {
  return useQuery({
    queryKey: BOOKING_KEYS.userLists(userId!),
    queryFn: () => getUserBookings(userId!),
    enabled: !!userId,
  });
};

export const useAllBookings = () => {
  return useQuery({
    queryKey: BOOKING_KEYS.lists(),
    queryFn: () => getAllBookings(),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingRequest) => createBooking(request),
    onSuccess: (_, variables) => {
      // Invalidate both user-specific and all bookings lists
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.userLists(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.lists(),
      });
    },
  });
};
