import React from 'react';
import { SearchInput } from '@/components/common/search-input';

interface BuildingFilterProps {
  keyword: string;
  status: string;
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: string) => void;
}

export function BuildingFilter({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
}: BuildingFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <SearchInput
        placeholder="Tìm kiếm tòa nhà..."
        value={keyword}
        onSearch={onKeywordChange}
        className="w-full sm:w-64"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-48"
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="ACTIVE">Đang hoạt động</option>
        <option value="MAINTENANCE">Bảo trì</option>
        <option value="INACTIVE">Ngừng hoạt động</option>
      </select>
    </div>
  );
}
