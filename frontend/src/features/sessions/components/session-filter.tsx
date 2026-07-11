import React from 'react';
import { SearchInput } from '@/components/common/search-input';

interface SessionFilterProps {
  plate: string;
  status: string;
  fromDate: string;
  onPlateChange: (plate: string) => void;
  onStatusChange: (status: string) => void;
  onFromDateChange: (date: string) => void;
}

export function SessionFilter({
  plate,
  status,
  fromDate,
  onPlateChange,
  onStatusChange,
  onFromDateChange,
}: SessionFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full flex-wrap">
      <SearchInput
        placeholder="Tìm kiếm biển số xe..."
        value={plate}
        onSearch={onPlateChange}
        className="w-full sm:w-64"
      />
      
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-48"
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="IN_PROGRESS">Đang trong bãi</option>
        <option value="COMPLETED">Đã ra bãi</option>
      </select>

      <input
        type="date"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-48"
        title="Lọc từ ngày"
      />
    </div>
  );
}
