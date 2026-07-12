"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit2, Clock } from "lucide-react";
import { SystemConfig } from "../types/config.type";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";

interface ConfigTableProps {
  data: SystemConfig[];
  isLoading?: boolean;
  onEdit: (config: SystemConfig) => void;
}

export function ConfigTable({ data, isLoading, onEdit }: ConfigTableProps) {
  const columns = useMemo<ColumnDef<SystemConfig>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => <div className="w-[80px]">ID</div>,
        cell: ({ row }) => (
          <div className="w-[80px] tabular-nums font-mono text-muted-foreground">
            {row.original.id}
          </div>
        ),
      },
      {
        accessorKey: "configKey",
        header: () => <div className="w-[250px]">Key</div>,
        cell: ({ row }) => (
          <div className="w-[250px]" title={row.original.description}>
            <span className="font-mono text-[13px] bg-slate-100 dark:bg-white/5 px-2.5 py-1.5 rounded-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/20 cursor-help">
              {row.original.configKey}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "configValue",
        header: () => <div className="w-[150px] lg:w-[200px]">Giá trị</div>,
        cell: ({ row }) => {
          const value = row.original.configValue;
          const isTime = /^([01]\d|2[0-3]):?([0-5]\d)$/.test(value);
          const isNumber = !isNaN(Number(value)) && value.trim() !== "";
          
          return (
            <div className="w-[150px] lg:w-[200px] flex items-center font-medium">
              {isTime ? (
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="tabular-nums">{value}</span>
                </div>
              ) : (
                <span className={`tabular-nums ${isNumber ? "font-semibold text-slate-700 dark:text-slate-200" : ""}`}>{value}</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
          <div className="min-w-[200px] max-w-[400px] text-muted-foreground line-clamp-2" title={row.original.description}>
            {row.original.description}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-2">Thao tác</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end pr-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => onEdit(row.original)}
              title="Sửa cấu hình"
              aria-label={`Sửa cấu hình ${row.original.configKey}`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit]
  );

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
      />
    </div>
  );
}
