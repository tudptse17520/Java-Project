// ---------------------------------------------
// Page Container
// Thành phần bọc ngoài cùng cho mọi trang trong hệ thống
// ---------------------------------------------

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl w-full mx-auto bg-background overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
