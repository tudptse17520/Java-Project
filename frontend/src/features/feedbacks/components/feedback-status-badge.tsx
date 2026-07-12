import { FeedbackStatus } from "../types/feedback.type";

interface FeedbackStatusBadgeProps {
  status: FeedbackStatus;
}

export function FeedbackStatusBadge({ status }: FeedbackStatusBadgeProps) {
  const config: Record<FeedbackStatus, { label: string; className: string }> = {
    REPORTED: { label: "Đã ghi nhận", className: "bg-red-100 text-red-800 border-red-200" },
    PROCESSING: { label: "Đang xử lý", className: "bg-blue-100 text-blue-800 border-blue-200" },
    RESOLVED: { label: "Đã giải quyết", className: "bg-green-100 text-green-800 border-green-200" },
  };

  const currentConfig = config[status] || { label: status, className: "bg-gray-100 text-gray-800" };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${currentConfig.className}`}>
      {currentConfig.label}
    </span>
  );
}
