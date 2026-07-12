// ---------------------------------------------
// Storage Utility
// Trình bao bọc an toàn tương tác localStorage/Cookie
// Tránh lỗi SSR (Server Side Rendering)
// ---------------------------------------------

/**
 * Kiểm tra có đang chạy phía client không
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Đọc giá trị từ localStorage an toàn
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Lưu giá trị vào localStorage an toàn
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save to localStorage: ${key}`);
  }
}

/**
 * Xóa giá trị khỏi localStorage
 */
export function removeStorageItem(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`Failed to remove from localStorage: ${key}`);
  }
}

/**
 * Đọc cookie theo tên
 */
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(
    new RegExp(`(^| )${name}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Ghi cookie an toàn
 */
export function setCookie(
  name: string,
  value: string,
  maxAge: number = 86400,
  path: string = "/"
): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Xóa cookie theo tên
 */
export function removeCookie(name: string, path: string = "/"): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}
