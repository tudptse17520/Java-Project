"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { BookingStatusBadge } from "./booking-status-badge";
import type { BookingListResponse } from "../types/booking.type";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, XCircle, LogIn } from "lucide-react";
import { CheckInModal } from "@/features/sessions/components/check-in-modal";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { BookingDetailDialog } from "./booking-detail-dialog";
import { useCancelBooking } from "../hooks/use-bookings";

export interface BookingContextData extends BookingListResponse {
  customerName?: string;
  customerPhone?: string;
  licensePlate?: string;
  vehicleTypeName?: string;
  expectedTimeOut?: string;
}

interface BookingTableProps {
  data: BookingContextData[];
  isLoading: boolean;
}

export function BookingTable({ data, isLoading }: BookingTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingContextData | null>(null);
  
  // States cho các modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const cancelMutation = useCancelBooking();

  const handleOpenDetail = (booking: BookingContextData) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleOpenCheckIn = (booking: BookingContextData) => {
    setSelectedBooking(booking);
    setIsCheckInOpen(true);
  };

  const handleOpenCancel = (booking: BookingContextData) => {
    setSelectedBooking(booking);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking?.bookingId) {
      cancelMutation.mutate(selectedBooking.bookingId, {
        onSuccess: () => {
          setIsCancelOpen(false);
          setSelectedBooking(null);
        }
      });
    }
  };

  const columns = useMemo<ColumnDef<BookingContextData>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "Mã Đặt chỗ",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            #{row.original.bookingId}
          </span>
        ),
      },
      {
        id: "customer",
        header: "Khách hàng",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.original.customerName || "Khách vãng lai"}</span>
            <span className="text-xs text-muted-foreground">{row.original.customerPhone || "N/A"}</span>
          </div>
        ),
      },
      {
        id: "vehicle",
        header: "Phương tiện",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-blue-600 dark:text-blue-400">{row.original.licensePlate || "Chưa cập nhật"}</span>
            <span className="text-xs text-muted-foreground">{row.original.vehicleTypeName || "N/A"}</span>
          </div>
        ),
      },
      {
        accessorKey: "parkingSlotId",
        header: "Vị trí",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            {row.original.parkingSlotName || `Slot ${row.original.parkingSlotId}`}
          </span>
        ),
      },
      {
        id: "timeRange",
        header: "Thời gian dự kiến",
        cell: ({ row }) => {
          const inDateStr = row.original.expectedTimeIn;
          const outDateStr = row.original.expectedTimeOut;
          
          const formatStr = (d?: string) => {
            if (!d) return "N/A";
            try {
              return format(parseISO(d), "dd/MM/yyyy HH:mm");
            } catch (e) {
              return d;
            }
          };

          return (
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="text-emerald-600 dark:text-emerald-500">Vào: <span className="font-medium">{formatStr(inDateStr)}</span></span>
              <span className="text-rose-600 dark:text-rose-500">Ra: <span className="font-medium">{formatStr(outDateStr)}</span></span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Thao tác</div>,
        cell: ({ row }) => {
          const status = row.original.status;
          const booking = row.original;

          return (
            <div className="flex items-center justify-end gap-2">
              {status === 'CONFIRMED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenCheckIn(booking)}
                  className="h-8 px-2 text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20 transition-all"
                  title="Check-in ngay"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Check-in
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenDetail(booking)}
                className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                title="Chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {(status === 'PENDING' || status === 'CONFIRMED') && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenCancel(booking)}
                  className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Hủy đặt chỗ"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="w-full overflow-x-auto rounded-md border border-border bg-card">
        <DataTable columns={columns} data={data} isLoading={isLoading} />
      </div>

      <BookingDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
      />

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        defaultValues={{
          plate: selectedBooking?.licensePlate || '',
          parkingSlotId: selectedBooking?.parkingSlotId || undefined,
        }}
      />

      <ConfirmDialog
        open={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đặt chỗ"
        description={`Bạn có chắc chắn muốn hủy lượt đặt chỗ ${selectedBooking ? '#' + selectedBooking.bookingId : ''} không? Hành động này sẽ trả lại vị trí đỗ và không thể hoàn tác.`}
        confirmText="Hủy đặt chỗ"
        cancelText="Đóng"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </>
  );
}
