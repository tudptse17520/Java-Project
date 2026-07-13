"use client";

import { SearchInput } from "@/components/common/search-input";

interface ConfigFilterProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
}

export function ConfigFilter({ onSearch, isLoading }: ConfigFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-full sm:w-[450px]">
        <SearchInput
          placeholder="Tìm theo tên cấu hình, key hoặc mô tả..."
          onSearch={onSearch}
        />
      </div>
    </div>
  );
}
