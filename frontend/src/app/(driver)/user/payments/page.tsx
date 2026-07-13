"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import * as paymentService from "@/services/payment.service";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/features/payments/types/payment.type";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/format-currency";
import { Badge } from "@/components/ui/badge";

export default function UserPaymentsPage() {
  const { user } = useAuthStore();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["user-payments", user?.id],
    queryFn: () => paymentService.getUserPayments(user?.id as number),
    enabled: !!user?.id,
  });

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "Mã giao dịch",
      cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
    },
    {
      accessorKey: "feeType",
      header: "Loại phí",
      cell: ({ row }) => {
        const type = row.original.feeType;
        if (type === "Booking_Deposit") return "Cọc đặt chỗ";
        if (type === "Parking_Fee") return "Phí gửi xe";
        if (type === "Lost_Ticket_Fine") return "Phạt mất thẻ";
        return type;
      },
    },
    {
      accessorKey: "amount",
      header: "Số tiền",
      cell: ({ row }) => (
        <span className="font-bold text-primary">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Phương thức",
      cell: ({ row }) => <span>{row.original.paymentMethod}</span>,
    },
    {
      accessorKey: "paymentTime",
      header: "Thời gian",
      cell: ({ row }) => (
        <span>
          {row.original.paymentTime
            ? dayjs(row.original.paymentTime, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === "SUCCESS") return <Badge className="bg-emerald-500 hover:bg-emerald-600">Thành công</Badge>;
        if (status === "PENDING") return <Badge variant="outline" className="text-amber-500 border-amber-500">Đang chờ</Badge>;
        if (status === "FAILED") return <Badge variant="destructive">Thất bại</Badge>;
        if (status === "CANCELLED") return <Badge variant="secondary">Đã hủy</Badge>;
        return <Badge>{status}</Badge>;
      },
    },
    {
      id: "reference",
      header: "Tham chiếu",
      cell: ({ row }) => {
        const p = row.original;
        if (p.parkingSessionId) return <span className="text-sm text-muted-foreground">Lượt gửi: #{p.parkingSessionId}</span>;
        if (p.bookingId) return <span className="text-sm text-muted-foreground">Đặt chỗ: #{p.bookingId}</span>;
        return "—";
      },
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Lịch sử thanh toán</h2>
      </div>
      <div className="bg-background rounded-md border p-4">
        <DataTable columns={columns} data={payments || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
