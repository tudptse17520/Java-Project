import { StatusBadge } from "@/components/common/status-badge";
import { type BookingStatus } from "../types/booking.type";

interface BookingStatusBadgeProps {
  status: BookingStatus | string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Đang chờ",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã vào bãi",
  CANCELLED: "Đã hủy",
  EXPIRED: "Đã hết hạn",
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const variant =
    status === "CHECKED_IN" || status === "CONFIRMED"
      ? "success"
      : status === "PENDING"
      ? "warning"
      : "danger";

  return (
    <StatusBadge variant={variant}>
      {STATUS_LABELS[status as string] || status}
    </StatusBadge>
  );
}
