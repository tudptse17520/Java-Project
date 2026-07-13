import axiosClient from "@/lib/axios-client";
import type {
  BookingRequest,
  BookingResponse,
  BookingListResponse,
} from "@/features/bookings/types/booking.type";

const BASE_PATH = "";

export const createBooking = async (
  request: BookingRequest
): Promise<BookingResponse> => {
  const response = await axiosClient.post<BookingResponse>(
    `${BASE_PATH}/bookings`,
    request
  );
  return response.data;
};

export const getUserBookings = async (
  userId: number
): Promise<BookingListResponse[]> => {
  const response = await axiosClient.get<BookingListResponse[]>(
    `${BASE_PATH}/users/${userId}/bookings`
  );
  return response.data;
};

export const getAllBookings = async (): Promise<BookingListResponse[]> => {
  const response = await axiosClient.get<BookingListResponse[]>(
    `${BASE_PATH}/bookings`
  );
  return response.data;
};

export const cancelBooking = async (bookingId: number): Promise<void> => {
  await axiosClient.put(`${BASE_PATH}/bookings/${bookingId}/cancel`);
};
