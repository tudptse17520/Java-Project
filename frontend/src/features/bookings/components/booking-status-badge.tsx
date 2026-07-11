import { StatusBadge } from "@/components/common/status-badge";
import { type BookingStatus } from "../types/booking.type";

interface BookingStatusBadgeProps {
  status: BookingStatus | string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Đang chờ",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Đã hoàn thành",
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const variant =
    status === "COMPLETED" || status === "CONFIRMED"
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
