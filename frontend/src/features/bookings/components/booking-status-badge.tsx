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
  let variant: "default" | "success" | "warning" | "danger" | "info" = "default";
  
  switch(status) {
    case "PENDING":
      variant = "warning";
      break;
    case "CONFIRMED":
      variant = "info"; // Xanh dương
      break;
    case "CHECKED_IN":
      variant = "success";
      break;
    case "CANCELLED":
      variant = "danger";
      break;
    case "EXPIRED":
      variant = "default"; // Màu xám
      break;
    default:
      variant = "default";
  }

  return (
    <StatusBadge variant={variant}>
      {STATUS_LABELS[status as string] || status}
    </StatusBadge>
  );
}
