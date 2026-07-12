"use client";

import { Edit } from "lucide-react";
import { SystemConfig } from "../types/config.type";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";

interface ConfigTableProps {
  data: SystemConfig[];
  isLoading?: boolean;
  onEdit: (config: SystemConfig) => void;
}

export function ConfigTable({ data, isLoading, onEdit }: ConfigTableProps) {
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Key",
      accessorKey: "configKey",
      cell: (value: any) => <span className="font-semibold text-primary">{value}</span>,
    },
    {
      header: "Giá trị",
      accessorKey: "configValue",
    },
    {
      header: "Mô tả",
      accessorKey: "description",
    },
    {
      header: "Thao tác",
      accessorKey: "id",
      cell: (_: any, row: SystemConfig) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="Không có cấu hình nào được tìm thấy."
    />
  );
}
