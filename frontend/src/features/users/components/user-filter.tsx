"use client";

import { SearchInput } from "@/components/common/search-input";
import { Role, ROLE_LABELS } from "@/constants/role";

interface UserFilterProps {
  keyword: string;
  role: string;
  onKeywordChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

export function UserFilter({
  keyword,
  role,
  onKeywordChange,
  onRoleChange,
}: UserFilterProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 w-full items-center">
      {/* Search Bar - 5 columns out of 12 (~42%) */}
      <div className="sm:col-span-5 w-full">
        <SearchInput
          placeholder="Tìm theo ID, tên đăng nhập, họ tên hoặc số điện thoại..."
          value={keyword}
          onSearch={onKeywordChange}
        />
      </div>
      
      {/* Role Filter - 3 columns (~25%) */}
      <div className="sm:col-span-3 w-full">
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="h-11 w-full rounded-lg border border-border/40 bg-background hover:bg-muted/10 px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm"
          aria-label="Lọc theo vai trò"
        >
          <option value="">Tất cả vai trò</option>
          {Object.values(Role).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter (Coming Soon) - 3 columns (~25%) */}
      <div className="sm:col-span-3 w-full opacity-60">
        <select
          className="h-11 w-full rounded-lg border border-dashed border-border/40 bg-muted/10 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed transition-colors shadow-sm"
          disabled
          aria-label="Lọc theo trạng thái"
        >
          <option value="">🚧 Sắp ra mắt</option>
        </select>
      </div>
      
      {/* Spare space for a potential button or just leave it empty to keep 45/20/20 ratio */}
    </div>
  );
}
