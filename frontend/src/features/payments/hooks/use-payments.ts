// ---------------------------------------------
// Payment Hooks (Data Layer)
// React Query hooks cho CRUD giao dịch thanh toán
// Tầng này CHỈ quản lý Server State (gọi API, cache, invalidate)
// ---------------------------------------------

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  PaymentFilter,
  PaymentRequest,
  ManualStatusRequest,
} from "@/features/payments/types/payment.type";
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  cancelPayment,
} from "@/services/payment.service";

/** Query key factory cho Payment */
const paymentKeys = {
  all: ["payments"] as const,
  list: (filter?: PaymentFilter) => [...paymentKeys.all, "list", filter] as const,
  detail: (id: number) => [...paymentKeys.all, "detail", id] as const,
};

/**
 * Hook lấy danh sách giao dịch (có filter tùy chọn).
 * Tự động refetch khi filter thay đổi.
 */
export function usePayments(filter?: PaymentFilter) {
  return useQuery({
    queryKey: paymentKeys.list(filter),
    queryFn: () => getPayments(filter),
  });
}

/**
 * Hook lấy chi tiết 1 giao dịch.
 * Chỉ gọi API khi có id (enabled).
 */
export function usePaymentDetail(id: number | null) {
  return useQuery({
    queryKey: paymentKeys.detail(id!),
    queryFn: () => getPaymentById(id!),
    enabled: id != null,
  });
}

/**
 * Hook tạo thanh toán mới.
 * Invalidate cache danh sách sau khi thành công.
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentRequest) => createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}

/**
 * Hook Staff cập nhật trạng thái thủ công.
 * Invalidate cache danh sách + detail sau khi thành công.
 */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ManualStatusRequest }) =>
      updatePaymentStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}

/**
 * Hook hủy giao dịch PENDING.
 * Invalidate cache danh sách sau khi thành công.
 */
export function useCancelPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}
