// ---------------------------------------------
// Toolbar Component
// Layout quy định vị trí của các thanh công cụ điều hướng dữ liệu
// ---------------------------------------------

import React from "react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  children?: React.ReactNode;
  searchSection?: React.ReactNode;
  filterSection?: React.ReactNode;
  actionSection?: React.ReactNode;
  className?: string;
}

export function Toolbar({
  children,
  searchSection,
  filterSection,
  actionSection,
  className,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-border bg-card p-4 rounded-lg",
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          {/* Left Section: Search and Filters */}
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center w-full">
            {searchSection && (
              <div className="w-full sm:max-w-xs">{searchSection}</div>
            )}
            {filterSection && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {filterSection}
              </div>
            )}
          </div>

          {/* Right Section: Main actions */}
          {actionSection && (
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto sm:justify-end">
              {actionSection}
            </div>
          )}
        </>
      )}
    </div>
  );
}
