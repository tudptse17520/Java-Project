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
 * Lấy danh sách giao dịch (có thể lọc theo paymentMethod, status, fromDate)
 * Backend trả về wrapper: { totalItems, message, data: [...] }
 */
export const getPayments = async (
  filter?: PaymentFilter
): Promise<Payment[]> => {
  const params: Record<string, string> = {};
  if (filter?.paymentMethod) params.paymentMethod = filter.paymentMethod;
  if (filter?.status) params.status = filter.status;
  if (filter?.fromDate) params.fromDate = filter.fromDate;

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
