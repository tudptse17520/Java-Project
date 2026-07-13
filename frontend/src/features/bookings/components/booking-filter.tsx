"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BOOKING_STATUS } from "../types/booking.type";

interface BookingFilterProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  status?: string;
  onStatusChange: (status: string | undefined) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Đang chờ",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã vào bãi",
  CANCELLED: "Đã hủy",
  EXPIRED: "Đã hết hạn",
};

export function BookingFilter({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
}: BookingFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full flex-wrap">
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm mã, khách hàng, biển số..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9 h-10 bg-background"
        />
      </div>

      <Select 
        value={status || "all"} 
        onValueChange={(val) => onStatusChange(val === "all" || !val ? undefined : val)}
      >
        <SelectTrigger className="w-[180px] h-10 bg-background">
          <SelectValue placeholder="Tất cả trạng thái">
            {status && STATUS_LABELS[status] ? STATUS_LABELS[status] : "Tất cả trạng thái"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          {Object.entries(BOOKING_STATUS).map(([key, val]) => (
            <SelectItem key={key} value={val}>
              {STATUS_LABELS[val] || val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
