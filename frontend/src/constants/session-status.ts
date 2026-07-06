// ---------------------------------------------
// Session Status Constants
// Trạng thái lượt gửi xe thực tế
// ---------------------------------------------

export enum SessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  [SessionStatus.IN_PROGRESS]: "Đang gửi",
  [SessionStatus.COMPLETED]: "Hoàn tất",
};
