// ---------------------------------------------
// Payment Actions Hook (UI Layer)
// Quản lý trạng thái UI: filter, dialogs, form submit
// Tầng này CHỈ quản lý Client State và gọi lệnh mutate
// ---------------------------------------------

import { useState, useCallback } from "react";
import type { Payment, PaymentFilter } from "@/features/payments/types/payment.type";
import type { CreatePaymentFormValues, ManualStatusFormValues } from "@/features/payments/schemas/payment.schema";
import {
  useCreatePayment,
  useUpdatePaymentStatus,
  useCancelPayment,
} from "@/features/payments/hooks/use-payments";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

export function usePaymentActions() {
  // =============================================
  // Filter State
  // =============================================
  const [filter, setFilter] = useState<PaymentFilter>({});

  const handleFilterChange = useCallback(
    (key: keyof PaymentFilter, value: string) => {
      setFilter((prev) => {
        const next = { ...prev };
        if (value) {
          next[key] = value;
        } else {
          delete next[key];
        }
        return next;
      });
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilter({});
  }, []);

  // =============================================
  // Create Payment Dialog State
  // =============================================
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // QR Dialog State
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrAmount, setQrAmount] = useState<number | null>(null);

  const createMutation = useCreatePayment();

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  const handleCreateSubmit = useCallback(
    (values: CreatePaymentFormValues) => {
      createMutation.mutate(
        {
          parking_session_id: values.parking_session_id ?? null,
          booking_id: values.booking_id ?? null,
          amount: values.amount,
          payment_method: values.payment_method,
          fee_type: values.fee_type,
        },
        {
          onSuccess: (data: any) => {
            toast.success("Tạo giao dịch thành công!");
            setIsCreateOpen(false);
            if (data?.payment_url) {
              setQrUrl(data.payment_url);
              setQrAmount(values.amount);
              setIsQrOpen(true);
            }
          },
          onError: (error) => {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const message = axiosError.response?.data?.message || "Lỗi khi tạo giao dịch";
            toast.error(message);
          },
        }
      );
    },
    [createMutation]
  );

  // =============================================
  // Detail Dialog State
  // =============================================
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleOpenDetail = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedPayment(null);
  }, []);

  // =============================================
  // Manual Status Dialog State
  // =============================================
  const [isManualStatusOpen, setIsManualStatusOpen] = useState(false);
  const [paymentForStatus, setPaymentForStatus] = useState<Payment | null>(null);
  const updateStatusMutation = useUpdatePaymentStatus();

  const handleOpenManualStatus = useCallback((payment: Payment) => {
    setPaymentForStatus(payment);
    setIsManualStatusOpen(true);
  }, []);

  const handleCloseManualStatus = useCallback(() => {
    setIsManualStatusOpen(false);
    setPaymentForStatus(null);
  }, []);

  const handleManualStatusSubmit = useCallback(
    (values: ManualStatusFormValues) => {
      if (!paymentForStatus) return;
      updateStatusMutation.mutate(
        {
          id: paymentForStatus.id,
          data: {
            status: values.status,
            note: values.note,
          },
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công!");
            setIsManualStatusOpen(false);
            setPaymentForStatus(null);
          },
          onError: (error) => {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const message = axiosError.response?.data?.message || "Lỗi khi cập nhật trạng thái";
            toast.error(message);
          },
        }
      );
    },
    [paymentForStatus, updateStatusMutation]
  );

  // =============================================
  // Cancel Payment State
  // =============================================
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [paymentToCancel, setPaymentToCancel] = useState<Payment | null>(null);
  const cancelMutation = useCancelPayment();

  const handleOpenCancel = useCallback((payment: Payment) => {
    setPaymentToCancel(payment);
    setIsConfirmCancelOpen(true);
  }, []);

  const handleCloseCancel = useCallback(() => {
    setIsConfirmCancelOpen(false);
    setPaymentToCancel(null);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    if (!paymentToCancel) return;
    cancelMutation.mutate(paymentToCancel.id, {
      onSuccess: () => {
        toast.success("Đã hủy giao dịch thành công!");
        setIsConfirmCancelOpen(false);
        setPaymentToCancel(null);
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.message || "Lỗi khi hủy giao dịch";
        toast.error(message);
      },
    });
  }, [paymentToCancel, cancelMutation]);

  return {
    // Filter
    filter,
    handleFilterChange,
    handleClearFilters,

    // Create Dialog
    isCreateOpen,
    handleOpenCreate,
    handleCloseCreate,
    handleCreateSubmit,
    isCreating: createMutation.isPending,

    // QR Dialog
    isQrOpen,
    qrUrl,
    qrAmount,
    handleCloseQr: () => {
      setIsQrOpen(false);
      setQrUrl(null);
      setQrAmount(null);
    },

    // Detail Dialog
    isDetailOpen,
    selectedPayment,
    handleOpenDetail,
    handleCloseDetail,

    // Manual Status Dialog
    isManualStatusOpen,
    paymentForStatus,
    handleOpenManualStatus,
    handleCloseManualStatus,
    handleManualStatusSubmit,
    isUpdatingStatus: updateStatusMutation.isPending,

    // Cancel
    isConfirmCancelOpen,
    paymentToCancel,
    handleOpenCancel,
    handleCloseCancel,
    handleConfirmCancel,
    isCancelling: cancelMutation.isPending,
  };
}
