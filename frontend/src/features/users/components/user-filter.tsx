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
    <>
      <div className="w-full sm:max-w-xs">
        <SearchInput
          placeholder="Tìm kiếm theo tên hoặc SĐT..."
          value={keyword}
          onSearch={onKeywordChange}
        />
      </div>
      <div className="w-full sm:max-w-[180px]">
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Tất cả vai trò</option>
          {Object.values(Role).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
