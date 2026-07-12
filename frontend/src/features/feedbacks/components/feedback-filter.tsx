"use client";

import { IssueType, FeedbackStatus } from "../types/feedback.type";

interface FeedbackFilterProps {
  onIssueTypeChange: (value: IssueType | "ALL") => void;
  onStatusChange: (value: FeedbackStatus | "ALL") => void;
}

export function FeedbackFilter({ onIssueTypeChange, onStatusChange }: FeedbackFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-card p-4 rounded-lg border">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Loại Sự Cố</label>
        <select 
          onChange={(e) => onIssueTypeChange(e.target.value as IssueType | "ALL")} 
          defaultValue="ALL"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="ALL">Tất cả loại</option>
          <option value="LOST_TICKET">Mất thẻ</option>
          <option value="WRONG_PLATE">Sai biển số</option>
          <option value="OVERTIME">Quá giờ</option>
          <option value="WRONG_PLACE">Đỗ sai vị trí</option>
          <option value="UNPAID_EXIT">Chưa thanh toán</option>
        </select>
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Trạng Thái</label>
        <select 
          onChange={(e) => onStatusChange(e.target.value as FeedbackStatus | "ALL")} 
          defaultValue="ALL"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="REPORTED">Đã ghi nhận</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="RESOLVED">Đã giải quyết</option>
        </select>
      </div>
    </div>
  );
}
