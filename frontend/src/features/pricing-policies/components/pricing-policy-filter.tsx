// ---------------------------------------------
// Pricing Policy Filter
// Dropdown lọc bảng giá theo loại phương tiện
// ---------------------------------------------

"use client";

import { VehicleType } from "@/features/vehicle-types/types/vehicle-type.type";

interface PricingPolicyFilterProps {
  vehicleTypes: VehicleType[];
  isLoading?: boolean;
  value?: number;
  onChange: (vehicleTypeId: number | undefined) => void;
}

export function PricingPolicyFilter({
  vehicleTypes,
  isLoading = false,
  value,
  onChange,
}: PricingPolicyFilterProps) {
  return (
    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
      </div>
      <label
        htmlFor="filter-vehicle-type"
        className="text-sm font-semibold text-slate-700 whitespace-nowrap"
      >
        Lọc theo loại xe
      </label>
      <div className="relative">
        <select
          id="filter-vehicle-type"
          className="appearance-none pl-4 pr-10 py-2 w-[200px] rounded-lg border border-slate-200 bg-white/80 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          value={value ?? ""}
          disabled={isLoading}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val ? Number(val) : undefined);
          }}
        >
          <option value="">
            {isLoading ? "Đang tải..." : "Tất cả phương tiện"}
          </option>
          {vehicleTypes.map((vt) => (
            <option key={vt.id} value={vt.id}>
              {vt.typeName}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

    </div>
  );
}
