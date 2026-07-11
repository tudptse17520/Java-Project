"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { BookingStatusBadge } from "./booking-status-badge";
import type { BookingListResponse } from "../types/booking.type";

interface BookingTableProps {
  data: BookingListResponse[];
  isLoading: boolean;
}

export function BookingTable({ data, isLoading }: BookingTableProps) {
  const columns = useMemo<ColumnDef<BookingListResponse>[]>(
    () => [
      {
        accessorKey: "booking_id",
        header: "Mã Đặt chỗ",
      },
      {
        accessorKey: "parking_slot_id",
        header: "Vị trí đỗ (Slot ID)",
      },
      {
        accessorKey: "expected_time_in",
        header: "Thời gian dự kiến vào",
        cell: ({ row }) => {
          const dateStr = row.original.expected_time_in;
          // You might want to format the date if it's ISO, e.g., using date-fns
          return <span>{dateStr}</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
      },
    ],
    []
  );

  return (
    <div className="w-full overflow-x-auto rounded-md border border-border">
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
