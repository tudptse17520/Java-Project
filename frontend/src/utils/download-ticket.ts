// ---------------------------------------------
// Download Ticket Utility
// Hỗ trợ tải xuống tệp/mã vé hoặc xử lý QR code
// ---------------------------------------------

/**
 * Tải file từ URL (blob download)
 * Placeholder - sẽ triển khai chi tiết khi có API
 */
export function downloadFile(url: string, filename: string): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Tải nội dung dạng text thành file
 */
export function downloadTextAsFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}
