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
      cell: ({ getValue }: any) => <span className="font-semibold text-primary">{getValue()}</span>,
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
      id: "actions",
      cell: ({ row }: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
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
    />
  );
}
