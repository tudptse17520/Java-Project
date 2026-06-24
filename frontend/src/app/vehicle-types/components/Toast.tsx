"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

export interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toasts: ToastData[];
  onRemove: (id: number) => void;
}

/**
 * Toast notification component.
 * Hiển thị thông báo thành công (xanh lá) hoặc lỗi (đỏ) ở góc trên bên phải.
 * Tự ẩn sau 4 giây.
 */
export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: number) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Start exit animation after 3.5s
    const exitTimer = setTimeout(() => setIsExiting(true), 3500);

    // Remove after 4s
    const removeTimer = setTimeout(() => onRemove(toast.id), 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onRemove]);

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl
        backdrop-blur-xl border min-w-[340px] max-w-[440px]
        transition-all duration-300 ease-out
        ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
        ${
          isSuccess
            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-100"
            : "bg-red-950/80 border-red-500/30 text-red-100"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isSuccess ? "bg-emerald-500/20" : "bg-red-500/20"
        }`}
      >
        {isSuccess ? (
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>

      {/* Message */}
      <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
          isSuccess
            ? "hover:bg-emerald-500/20 text-emerald-400"
            : "hover:bg-red-500/20 text-red-400"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
