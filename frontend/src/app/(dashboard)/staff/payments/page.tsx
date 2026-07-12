// ---------------------------------------------
// Payment Management Page
// Trang quản lý thanh toán cho Parking Staff
// Route: /staff/payments
// ---------------------------------------------

"use client";

import { PageHeader } from "@/components/common/page-header";
import { PageContainer } from "@/components/common/page-container";
import { Toolbar } from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Plus } from "lucide-react";
import { usePayments, useAllSessions } from "@/features/payments/hooks/use-payments";
import { usePaymentActions } from "@/features/payments/hooks/use-payment-actions";
import { PaymentTable } from "@/features/payments/components/payment-table";
import { PaymentFilter } from "@/features/payments/components/payment-filter";
import { PaymentCreateDialog } from "@/features/payments/components/payment-create-dialog";
import { PaymentDetailDialog } from "@/features/payments/components/payment-detail-dialog";
import { PaymentManualStatusDialog } from "@/features/payments/components/payment-manual-status-dialog";
import { PaymentQrDialog } from "@/features/payments/components/payment-qr-dialog";
import { useMemo } from "react";

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
    isQrOpen,
    qrUrl,
    qrAmount,
    handleCloseQr,
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

  // Hook Data: lấy danh sách giao dịch (có filter server-side)
  const { data: payments = [], isLoading } = usePayments(filter);
  
  // Hook Data: lấy danh sách tất cả session để map biển số xe (client-side)
  const { data: allSessions = [] } = useAllSessions();

  // Map biển số xe vào payment và filter theo biển số xe nếu có
  const enrichedPayments = useMemo(() => {
    return payments
      .map((payment: any) => {
        const session = allSessions.find((s: any) => s.id === payment.parkingSessionId);
        return { ...payment, plate: session?.plate || "" };
      })
      .filter((payment: any) => {
        if (filter.feeType && payment.feeType !== filter.feeType) return false;
        if (!filter.plate) return true;
        return payment.plate.includes(filter.plate.toUpperCase());
      });
  }, [payments, allSessions, filter.plate, filter.feeType]);

  return (
    <PageContainer>
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
      <Toolbar>
        <PaymentFilter
          filter={filter}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </Toolbar>

      {/* Bảng dữ liệu */}
      <PaymentTable
        data={enrichedPayments as any} // we cast to any because Payment type doesn't have plate yet, or we could update Payment type
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

      {/* Dialog hiển thị QR Code */}
      <PaymentQrDialog
        open={isQrOpen}
        onClose={handleCloseQr}
        paymentUrl={qrUrl}
        amount={qrAmount}
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
    </PageContainer>
  );
}
