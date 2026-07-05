// ---------------------------------------------
// Feedback Status Constants
// Trạng thái xử lý sự cố/phản hồi
// ---------------------------------------------

export enum FeedbackStatus {
  REPORTED = "REPORTED",
  PROCESSING = "PROCESSING",
  RESOLVED = "RESOLVED",
}

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  [FeedbackStatus.REPORTED]: "Đã báo cáo",
  [FeedbackStatus.PROCESSING]: "Đang xử lý",
  [FeedbackStatus.RESOLVED]: "Đã giải quyết",
};
