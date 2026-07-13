import React from 'react';
import { Portal } from '@/components/common/portal';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { BookingContextData } from './booking-table';
import { format, parseISO } from 'date-fns';
import { BookingStatusBadge } from './booking-status-badge';

interface BookingDetailDialogProps {
  booking: BookingContextData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailDialog({ booking, isOpen, onClose }: BookingDetailDialogProps) {
  if (!isOpen || !booking) return null;

  const formatStr = (d?: string) => {
    if (!d) return "N/A";
    try {
      return format(parseISO(d), "dd/MM/yyyy HH:mm");
    } catch (e) {
      return d;
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose} 
        />
        
        {/* Dialog Panel */}
        <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Chi tiết đặt chỗ #{booking.bookingId}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-muted-foreground">Trạng thái</div>
                <div className="col-span-2">
                  <BookingStatusBadge status={booking.status} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-muted-foreground">Khách hàng</div>
                <div className="col-span-2">
                  <p className="font-medium">{booking.customerName || "Khách vãng lai"}</p>
                  <p className="text-sm text-muted-foreground">{booking.customerPhone || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-muted-foreground">Phương tiện</div>
                <div className="col-span-2">
                  <p className="font-medium text-blue-600 dark:text-blue-400">{booking.licensePlate || "Chưa cập nhật"}</p>
                  <p className="text-sm text-muted-foreground">{booking.vehicleTypeName || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-muted-foreground">Vị trí đỗ</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    {booking.parkingSlotName || `Slot ${booking.parkingSlotId}`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-muted-foreground">Thời gian dự kiến</div>
                <div className="col-span-2 flex flex-col gap-1">
                  <p className="text-sm text-emerald-600 dark:text-emerald-500">
                    Vào: <span className="font-medium">{formatStr(booking.expectedTimeIn)}</span>
                  </p>
                  <p className="text-sm text-rose-600 dark:text-rose-500">
                    Ra: <span className="font-medium">{formatStr(booking.expectedTimeOut)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t bg-muted/50 rounded-b-lg">
            <Button variant="outline" onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
