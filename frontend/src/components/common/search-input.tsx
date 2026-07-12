// ---------------------------------------------
// Search Input
// Ô tìm kiếm tích hợp cơ chế chống lặp lệnh (useDebounce)
// ---------------------------------------------

"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  placeholder = "Tìm kiếm...",
  value: controlledValue,
  onSearch,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");

  // Sync with controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors duration-200 peer-focus:text-primary" />
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        className={cn(
          "peer h-11 w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm shadow-sm",
          "placeholder:text-muted-foreground/50",
          "transition-all duration-200",
          "hover:border-ring/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring"
        )}
      />
      {internalValue && (
        <button
          type="button"
          onClick={() => setInternalValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-all duration-200"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
