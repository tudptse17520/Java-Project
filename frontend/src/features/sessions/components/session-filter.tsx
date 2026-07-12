import React from 'react';
import { SearchInput } from '@/components/common/search-input';

interface SessionFilterProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

export const SessionFilter = ({ keyword, onKeywordChange, status, onStatusChange }: SessionFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="w-full sm:w-80">
        <SearchInput
          value={keyword}
          onSearch={onKeywordChange}
          placeholder="Tìm theo biển số xe..."
        />
      </div>
      <div className="w-full sm:w-48">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="IN_PROGRESS">Đang đỗ</option>
          <option value="COMPLETED">Đã ra</option>
        </select>
      </div>
    </div>
  );
};
