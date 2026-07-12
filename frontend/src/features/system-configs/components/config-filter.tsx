"use client";

import { SearchInput } from "@/components/common/search-input";

interface ConfigFilterProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
}

export function ConfigFilter({ onSearch, isLoading }: ConfigFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-[300px]">
        <SearchInput
          placeholder="Tìm kiếm cấu hình..."
          onSearch={onSearch}
        />
      </div>
    </div>
  );
}
