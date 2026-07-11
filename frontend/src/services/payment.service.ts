// ---------------------------------------------
// Payment Service
// Gọi API thanh toán qua axiosClient
// ---------------------------------------------

import axiosClient from "@/lib/axios-client";
import type {
  Payment,
  PaymentListResponse,
  PaymentRequest,
  PaymentFilter,
  ManualStatusRequest,
} from "@/features/payments/types/payment.type";

const BASE_PATH = "/payments";

/**
 * Lấy danh sách giao dịch (có thể lọc theo payment_method, status, from_date)
 * Backend trả về wrapper: { total_items, message, data: [...] }
 */
const mapPaymentMethodToBackend = (method: string): string => {
  const map: Record<string, string> = {
    "CASH": "Cash",
    "MOMO": "Momo",
    "VNPAY": "Vnpay",
    "CREDIT_CARD": "Credit_Card"
  };
  return map[method.toUpperCase()] || method;
};

export const getPayments = async (
  filter?: PaymentFilter
): Promise<Payment[]> => {
  const params: Record<string, string> = {};
  if (filter?.payment_method) params.payment_method = mapPaymentMethodToBackend(filter.payment_method);
  if (filter?.status) params.status = filter.status;
  if (filter?.from_date) params.from_date = filter.from_date;

  const response = await axiosClient.get<PaymentListResponse>(BASE_PATH, {
    params,
  });
  return response.data.data.map(p => ({
    ...p,
    payment_method: p.payment_method ? p.payment_method.toUpperCase() : p.payment_method
  }));
};

/**
 * Lấy chi tiết biên lai thanh toán
 */
export const getPaymentById = async (id: number): Promise<Payment> => {
  const response = await axiosClient.get<Payment>(`${BASE_PATH}/${id}`);
  const payment = response.data;
  if (payment && payment.payment_method) {
    payment.payment_method = payment.payment_method.toUpperCase();
  }
  return payment;
};

export const getRemainingDebt = async (sessionId: number): Promise<{
  session_id: number;
  total_fee: number;
  paid_fee: number;
  remaining_fee: number;
}> => {
  const response = await axiosClient.get(`${BASE_PATH}/sessions/${sessionId}/debt`);
  return response.data;
};



export interface ParkingSessionMinimal {
  id: number;
  plate: string;
  ticket_code: string;
  status: string;
}

export const getSessionByPlate = async (plate: string): Promise<ParkingSessionMinimal | null> => {
  if (!plate || plate.trim() === "") return null;
  const response = await axiosClient.get(`/sessions?plate=${encodeURIComponent(plate)}&status=IN_PROGRESS`);
  const data = response.data?.data;
  if (Array.isArray(data) && data.length > 0) {
    // Return the latest one
    return data[0] as ParkingSessionMinimal;
  }
  return null;
};

export const getAllSessions = async (): Promise<any[]> => {
  const response = await axiosClient.get(`/sessions`);
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
};

export const getSessionById = async (id: number): Promise<any | null> => {
  const response = await axiosClient.get(`/sessions`);
  const data = response.data?.data;
  if (Array.isArray(data)) {
    return data.find((s: any) => s.id === id) || null;
  }
  return null;
};

export const getAllBookings = async (): Promise<any[]> => {
  const response = await axiosClient.get(`/bookings`);
  // The API returns the list directly or inside data? Let's check BookingController
  // `ResponseEntity.ok(response)` which means it returns a List directly, NOT wrapped in { data: ... }
  // Wait, let's verify. Usually Spring Boot returns the list directly if not wrapped in a custom response object.
  // I'll just check if it's an array.
  return Array.isArray(response.data) ? response.data : [];
};

export const getBookingById = async (id: number): Promise<any | null> => {
  const bookings = await getAllBookings();
  return bookings.find((b: any) => b.booking_id === id) || null;
};

/**
 * Tạo thanh toán mới
 */
export const createPayment = async (
  data: PaymentRequest
): Promise<Payment> => {
  const payload = {
    ...data,
    payment_method: data.payment_method ? mapPaymentMethodToBackend(data.payment_method) : data.payment_method
  };
  const response = await axiosClient.post<Payment>(BASE_PATH, payload);
  const payment = response.data;
  if (payment && payment.payment_method) {
    payment.payment_method = payment.payment_method.toUpperCase();
  }
  return payment;
};

/**
 * Staff cập nhật trạng thái thủ công (PENDING → SUCCESS/FAILED)
 */
export const updatePaymentStatus = async (
  id: number,
  data: ManualStatusRequest
): Promise<Payment> => {
  const response = await axiosClient.patch<Payment>(
    `${BASE_PATH}/${id}/status`,
    data
  );
  const payment = response.data;
  if (payment && payment.payment_method) {
    payment.payment_method = payment.payment_method.toUpperCase();
  }
  return payment;
};

/**
 * Hủy giao dịch đang PENDING
 */
export const cancelPayment = async (id: number): Promise<Payment> => {
  const response = await axiosClient.patch<Payment>(
    `${BASE_PATH}/${id}/cancel`
  );
  return response.data;
};
