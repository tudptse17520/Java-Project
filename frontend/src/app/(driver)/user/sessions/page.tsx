"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { sessionService } from "@/services/session.service";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { SessionResponse } from "@/features/sessions/types/session.type";
import { SessionStatusBadge } from "@/features/sessions/components/session-status-badge";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { PaymentModal } from "../components/payment-modal";

export default function UserSessionsPage() {
  const { user } = useAuthStore();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["user-sessions", user?.id],
    queryFn: () => sessionService.getUserSessions(user?.id as number),
    enabled: !!user?.id,
  });

  const handlePaymentClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setPaymentModalOpen(true);
  };

  const columns: ColumnDef<SessionResponse>[] = [
    {
      accessorKey: "ticketCode",
      header: "Mã vé",
      cell: ({ row }) => <span className="font-medium">{row.original.ticketCode || "—"}</span>,
    },
    {
      accessorKey: "plate",
      header: "Biển số",
      cell: ({ row }) => <span className="font-bold text-primary">{row.original.plate}</span>,
    },
    {
      accessorKey: "timeIn",
      header: "Giờ vào",
      cell: ({ row }) => <span>{dayjs(row.original.timeIn).format("DD/MM/YYYY HH:mm")}</span>,
    },
    {
      accessorKey: "timeOut",
      header: "Giờ ra",
      cell: ({ row }) => <span>{row.original.timeOut ? dayjs(row.original.timeOut).format("DD/MM/YYYY HH:mm") : "—"}</span>,
    },
    {
      id: "totalFee",
      header: "Tổng phí",
      cell: ({ row }) => (
        <span className="font-medium text-amber-600">
          {row.original.totalFee ? formatCurrency(row.original.totalFee) : "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <SessionStatusBadge status={row.original.status as any} />,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const session = row.original;
        if (session.totalFee) {
          return (
            <Button size="sm" variant="outline" onClick={() => handlePaymentClick(session.id)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Thanh toán
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Lịch sử lượt gửi xe</h2>
      </div>
      <div className="bg-background rounded-md border p-4">
        <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      </div>

      {selectedSessionId && (
        <PaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          sessionId={selectedSessionId}
        />
      )}
    </div>
  );
}
