// ---------------------------------------------
// Pricing Policy Filter
// Dropdown lọc bảng giá theo loại phương tiện
// ---------------------------------------------

"use client";

import { VehicleType } from "@/features/vehicle-types/types/vehicle-type.type";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PricingPolicyFilterProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  vehicleTypes: VehicleType[];
  isLoading?: boolean;
  value?: number;
  onChange: (vehicleTypeId: number | undefined) => void;
}

export function PricingPolicyFilter({
  keyword,
  onKeywordChange,
  vehicleTypes,
  isLoading = false,
  value,
  onChange,
}: PricingPolicyFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full flex-wrap">
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm loại phương tiện..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9 h-10 bg-background"
        />
      </div>

      <Select 
        value={value?.toString() || undefined} 
        onValueChange={(val) => onChange(val === "all" ? undefined : Number(val))}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[200px] h-10 bg-background">
          <SelectValue placeholder={isLoading ? "Đang tải..." : "Tất cả phương tiện"}>
            {value ? vehicleTypes.find((vt) => vt.id === value)?.typeName : "Tất cả phương tiện"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả phương tiện</SelectItem>
          {vehicleTypes.map((vt) => (
            <SelectItem key={vt.id} value={vt.id.toString()}>
              {vt.typeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
