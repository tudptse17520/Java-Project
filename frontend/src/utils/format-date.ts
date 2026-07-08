// ---------------------------------------------
// Format Date Utility
// Định dạng chuỗi ngày tháng năm chuẩn (DD-MM-YYYY HH:mm)
// ---------------------------------------------

import dayjs from "dayjs";

/**
 * Format date sang định dạng DD/MM/YYYY
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return dayjs(date).format("DD/MM/YYYY");
}

/**
 * Format date sang định dạng DD/MM/YYYY HH:mm
 */
export function formatDateTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "—";
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}

/**
 * Format date sang định dạng tương đối (e.g. "2 giờ trước")
 * Placeholder - cần cài thêm dayjs plugin relativeTime nếu cần
 */
export function formatRelativeTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "—";
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}
