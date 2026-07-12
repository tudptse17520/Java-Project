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
    <div className="flex items-center gap-2">
      <label
        htmlFor="filter-vehicle-type"
        className="text-sm font-medium text-muted-foreground whitespace-nowrap"
      >
        Lọc theo loại xe:
      </label>
      <select
        id="filter-vehicle-type"
        className="rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        value={value ?? ""}
        disabled={isLoading}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val ? Number(val) : undefined);
        }}
      >
        <option value="">
          {isLoading ? "Đang tải..." : "Tất cả loại xe"}
        </option>
        {vehicleTypes.map((vt) => (
          <option key={vt.id} value={vt.id}>
            {vt.typeName}
          </option>
        ))}
      </select>
    </div>
  );
}
