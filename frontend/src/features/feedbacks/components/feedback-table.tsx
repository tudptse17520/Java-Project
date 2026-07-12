"use client";

import { Edit, Eye } from "lucide-react";
import { Feedback } from "../types/feedback.type";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { FeedbackStatusBadge } from "./feedback-status-badge";

interface FeedbackTableProps {
  data: Feedback[];
  isLoading?: boolean;
  onView: (feedback: Feedback) => void;
  onEdit: (feedback: Feedback) => void;
}

export function FeedbackTable({ data, isLoading, onView, onEdit }: FeedbackTableProps) {
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Lượt gửi xe (ID)",
      accessorKey: "parkingSessionId",
      cell: ({ getValue }: any) => <span className="font-semibold text-primary">#{getValue()}</span>,
    },
    {
      header: "Loại sự cố",
      accessorKey: "issueType",
      cell: ({ getValue }: any) => {
        const typeMap: Record<string, string> = {
          LOST_TICKET: "Mất thẻ",
          WRONG_PLATE: "Sai biển số",
          OVERTIME: "Quá giờ",
          WRONG_PLACE: "Đỗ sai vị trí",
          UNPAID_EXIT: "Chưa thanh toán",
        };
        const val = getValue();
        return <span>{typeMap[val] || val}</span>;
      },
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ getValue }: any) => <FeedbackStatusBadge status={getValue()} />,
    },
    {
      header: "Thao tác",
      accessorKey: "id",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(row.original)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Chi tiết
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Xử lý
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
    />
  );
}
