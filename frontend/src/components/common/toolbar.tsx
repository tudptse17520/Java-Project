// ---------------------------------------------
// Toolbar Component
// Bố cục khung chứa (layout container) cho các thanh công cụ điều hướng dữ liệu
// ---------------------------------------------

import React from "react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-border bg-card p-4 rounded-lg w-full",
        className
      )}
    >
      {children}
    </div>
  );
}

