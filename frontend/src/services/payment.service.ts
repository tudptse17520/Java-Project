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
export const getPayments = async (
  filter?: PaymentFilter
): Promise<Payment[]> => {
  const params: Record<string, string> = {};
  if (filter?.payment_method) params.payment_method = filter.payment_method;
  if (filter?.status) params.status = filter.status;
  if (filter?.from_date) params.from_date = filter.from_date;

  const response = await axiosClient.get<PaymentListResponse>(BASE_PATH, {
    params,
  });
  return response.data.data;
};

/**
 * Lấy chi tiết biên lai thanh toán
 */
export const getPaymentById = async (id: number): Promise<Payment> => {
  const response = await axiosClient.get<Payment>(`${BASE_PATH}/${id}`);
  return response.data;
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

/**
 * Tạo thanh toán mới
 */
export const createPayment = async (
  data: PaymentRequest
): Promise<Payment> => {
  const response = await axiosClient.post<Payment>(BASE_PATH, data);
  return response.data;
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
  return response.data;
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
