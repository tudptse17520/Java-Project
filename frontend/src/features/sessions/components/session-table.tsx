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
        accessorKey: "timeIn",
        header: "Thời gian vào",
        cell: ({ row }) => formatDateTime(row.original.timeIn),
      },
      {
        accessorKey: "timeOut",
        header: "Thời gian ra",
        cell: ({ row }) =>
          row.original.timeOut
            ? formatDateTime(row.original.timeOut)
            : "—",
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <SessionStatusBadge timeOut={row.original.timeOut} />
        ),
      },
      {
        accessorKey: "totalFee",
        header: "Tổng phí (VNĐ)",
        cell: ({ row }) =>
          row.original.totalFee != null
            ? formatCurrency(row.original.totalFee)
            : "—",
      },
    ],
    []
  );

  return <DataTable columns={columns} data={sessions} isLoading={isLoading} />;
}
