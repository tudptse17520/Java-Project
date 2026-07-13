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
 * Có thể xử lý định dạng chuẩn ISO hoặc định dạng DD-MM-YYYY HH:mm:ss từ API trả về
 */
export function formatDateTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "—";

  // Check if string is in format DD-MM-YYYY HH:mm:ss
  if (typeof date === "string" && date.match(/^\d{2}-\d{2}-\d{4}/)) {
    const [d, m, yAndT] = date.split("-");
    const [y, t] = yAndT.split(" ");
    // Convert to ISO-like string YYYY-MM-DDTHH:mm:ss so dayjs parses it correctly
    const isoString = `${y}-${m}-${d}T${t}`;
    return dayjs(isoString).format("DD/MM/YYYY HH:mm");
  }

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
