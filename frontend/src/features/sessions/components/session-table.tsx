"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { SessionStatusBadge } from "./session-status-badge";
import type { SessionResponse } from "../types/session.type";
import { formatCurrency } from "@/utils/format-currency";
import { formatDateTime } from "@/utils/format-date";

interface SessionTableProps {
  sessions: SessionResponse[];
  isLoading: boolean;
}

export function SessionTable({ sessions, isLoading }: SessionTableProps) {
  const columns = useMemo<ColumnDef<SessionResponse>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "plate",
        header: "Biển số",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.plate}</span>
        ),
      },
      {
        accessorKey: "time_in",
        header: "Thời gian vào",
        cell: ({ row }) => formatDateTime(row.original.time_in),
      },
      {
        accessorKey: "time_out",
        header: "Thời gian ra",
        cell: ({ row }) =>
          row.original.time_out
            ? formatDateTime(row.original.time_out)
            : "—",
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <SessionStatusBadge timeOut={row.original.time_out} />
        ),
      },
      {
        accessorKey: "total_fee",
        header: "Tổng phí (VNĐ)",
        cell: ({ row }) =>
          row.original.total_fee != null
            ? formatCurrency(row.original.total_fee)
            : "—",
      },
    ],
    []
  );

  return <DataTable columns={columns} data={sessions} isLoading={isLoading} />;
}
