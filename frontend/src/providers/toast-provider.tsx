// ---------------------------------------------
// Toast Provider
// Cung cấp trình hiển thị thông báo trạng thái nhanh
// ---------------------------------------------

"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
}
