// ---------------------------------------------
// Format Currency Utility
// Quy đổi số thành định dạng tiền tệ Việt Nam Đồng (VND)
// ---------------------------------------------

/**
 * Format số thành định dạng tiền VND
 * @example formatCurrency(150000) => "150.000 ₫"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format số thành dạng ngắn gọn
 * @example formatCompactCurrency(1500000) => "1,5tr"
 */
export function formatCompactCurrency(
  amount: number | null | undefined
): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(".0", "")} tỷ`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(".0", "")} tr`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1).replace(".0", "")} k`;
  }
  return `${amount} ₫`;
}
