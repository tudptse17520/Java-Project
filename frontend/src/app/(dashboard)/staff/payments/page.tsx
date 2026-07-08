// ---------------------------------------------
// Payment Management Page
// Trang quản lý thanh toán cho Parking Staff
// Route: /staff/payments
// ---------------------------------------------

"use client";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Plus } from "lucide-react";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { usePaymentActions } from "@/features/payments/hooks/use-payment-actions";
import { PaymentTable } from "@/features/payments/components/payment-table";
import { PaymentFilter } from "@/features/payments/components/payment-filter";
import { PaymentCreateDialog } from "@/features/payments/components/payment-create-dialog";
import { PaymentDetailDialog } from "@/features/payments/components/payment-detail-dialog";
import { PaymentManualStatusDialog } from "@/features/payments/components/payment-manual-status-dialog";

export default function PaymentPage() {
  // Hook Action: quản lý trạng thái UI
  const {
    filter,
    handleFilterChange,
    handleClearFilters,
    isCreateOpen,
    handleOpenCreate,
    handleCloseCreate,
    handleCreateSubmit,
    isCreating,
    isDetailOpen,
    selectedPayment,
    handleOpenDetail,
    handleCloseDetail,
    isManualStatusOpen,
    paymentForStatus,
    handleOpenManualStatus,
    handleCloseManualStatus,
    handleManualStatusSubmit,
    isUpdatingStatus,
    isConfirmCancelOpen,
    paymentToCancel,
    handleOpenCancel,
    handleCloseCancel,
    handleConfirmCancel,
    isCancelling,
  } = usePaymentActions();

  // Hook Data: lấy danh sách giao dịch (có filter)
  const { data: payments = [], isLoading } = usePayments(filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Quản lý thanh toán"
        description="Quản lý giao dịch thanh toán phí gửi xe, cọc đặt chỗ và phí phạt."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Tạo thanh toán
          </Button>
        }
      />

      {/* Bộ lọc */}
      <PaymentFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Bảng dữ liệu */}
      <PaymentTable
        data={payments}
        isLoading={isLoading}
        onViewDetail={handleOpenDetail}
        onManualStatus={handleOpenManualStatus}
        onCancel={handleOpenCancel}
      />

      {/* Dialog tạo thanh toán */}
      <PaymentCreateDialog
        open={isCreateOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      {/* Dialog chi tiết biên lai */}
      <PaymentDetailDialog
        open={isDetailOpen}
        onClose={handleCloseDetail}
        payment={selectedPayment}
      />

      {/* Dialog cập nhật trạng thái thủ công */}
      <PaymentManualStatusDialog
        open={isManualStatusOpen}
        onClose={handleCloseManualStatus}
        onSubmit={handleManualStatusSubmit}
        payment={paymentForStatus}
        isLoading={isUpdatingStatus}
      />

      {/* Confirm Dialog hủy giao dịch */}
      <ConfirmDialog
        open={isConfirmCancelOpen}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy giao dịch"
        description={
          paymentToCancel
            ? `Bạn có chắc chắn muốn hủy giao dịch #${paymentToCancel.id}? Hành động này không thể hoàn tác.`
            : ""
        }
        confirmText="Hủy giao dịch"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
}
