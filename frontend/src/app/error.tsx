"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
        <AlertCircle className="h-10 w-10 text-rose-600 dark:text-rose-400" />
      </div>
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight">
          Đã xảy ra lỗi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Hệ thống gặp sự cố không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu lỗi tiếp tục.
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/85"
      >
        <RotateCcw className="h-4 w-4" />
        Thử lại
      </button>
    </div>
  );
}
