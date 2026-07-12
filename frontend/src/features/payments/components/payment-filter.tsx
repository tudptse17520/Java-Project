// ---------------------------------------------
// Payment Filter
// Bộ lọc giao dịch theo phương thức, trạng thái, từ ngày
// ---------------------------------------------

"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentFilter as PaymentFilterType } from "@/features/payments/types/payment.type";
import { PAYMENT_METHODS, FEE_TYPES } from "@/features/payments/constants/payment.constants";
import { PaymentStatus, PAYMENT_STATUS_LABELS } from "@/constants/payment-status";

interface PaymentFilterProps {
  filter: PaymentFilterType;
  onFilterChange: (key: keyof PaymentFilterType, value: string) => void;
  onClearFilters: () => void;
}

/**
 * Convert Date object sang DD-MM-YYYY string để gửi lên API
 */
function formatDateToDDMMYYYY(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

/**
 * Convert DD-MM-YYYY string sang YYYY-MM-DD cho input[type=date]
 */
function formatDateToInput(ddmmyyyy: string): string {
  if (!ddmmyyyy) return "";
  const [day, month, year] = ddmmyyyy.split("-");
  return `${year}-${month}-${day}`;
}

const statusOptions = Object.values(PaymentStatus);

export function PaymentFilter({
  filter,
  onFilterChange,
  onClearFilters,
}: PaymentFilterProps) {
  const hasFilters =
    filter.paymentMethod || filter.status || filter.fromDate || filter.plate || filter.feeType;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Phương thức thanh toán */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Phương thức
        </label>
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={filter.paymentMethod || ""}
          onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
        >
          <option value="">Tất cả</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loại phí */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Loại phí
        </label>
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={filter.feeType || ""}
          onChange={(e) => onFilterChange("feeType", e.target.value)}
        >
          <option value="">Tất cả</option>
          {FEE_TYPES.map((feeType) => (
            <option key={feeType.value} value={feeType.value}>
              {feeType.label}
            </option>
          ))}
        </select>
      </div>

      {/* Trạng thái */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Trạng thái
        </label>
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={filter.status || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="">Tất cả</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {PAYMENT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {/* Biển số xe */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Biển số xe
        </label>
        <input
          type="text"
          placeholder="Nhập biển số..."
          className="h-9 w-32 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring uppercase"
          value={filter.plate || ""}
          onChange={(e) => onFilterChange("plate", e.target.value.toUpperCase())}
        />
      </div>

      {/* Từ ngày */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Từ ngày
        </label>
        <input
          type="date"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={filter.fromDate ? formatDateToInput(filter.fromDate) : ""}
          onChange={(e) => {
            const formatted = e.target.value
              ? formatDateToDDMMYYYY(e.target.value)
              : "";
            onFilterChange("fromDate", formatted);
          }}
        />
      </div>

      {/* Nút xóa bộ lọc */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="mr-1 h-3 w-3" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
