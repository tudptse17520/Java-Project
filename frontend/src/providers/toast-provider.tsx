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
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          padding: "12px 16px",
          fontSize: "14px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          backdropFilter: "blur(8px)",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "oklch(0.60 0.18 155)",
            secondary: "white",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "oklch(0.55 0.22 25)",
            secondary: "white",
          },
        },
      }}
    />
  );
}
