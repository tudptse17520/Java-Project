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
          placeholder="Tìm biển số hoặc mã vé..."
        />
      </div>
      <div className="w-full sm:w-48">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="flex h-11 w-full items-center justify-between rounded-lg border border-border/40 bg-background hover:bg-muted/10 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="IN_PROGRESS">Đang gửi</option>
          <option value="COMPLETED">Đã ra</option>
          <option value="OVERDUE">Quá hạn</option>
          <option value="PENDING_PAYMENT">Chờ thanh toán</option>
        </select>
      </div>
    </div>
  );
};
