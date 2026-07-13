import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
} from "@/services/booking.service";
import type { BookingRequest } from "../types/booking.type";
import toast from "react-hot-toast";

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
    refetchInterval: 5000,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingRequest) => createBooking(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.all,
      });
      toast.success("Đặt chỗ thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đặt chỗ thất bại");
    }
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.all,
      });
      toast.success("Hủy đặt chỗ thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Hủy đặt chỗ thất bại");
    }
  });
};
