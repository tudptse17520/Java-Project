"use client";

import { useEffect } from "react";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-destructive">
        Đã xảy ra lỗi!
      </h1>
      <p className="text-muted-foreground">
        Hệ thống gặp sự cố không mong muốn.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Thử lại
      </button>
    </div>
  );
}
