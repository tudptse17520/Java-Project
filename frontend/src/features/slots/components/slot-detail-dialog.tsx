import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/portal";
import { ParkingSlot } from "../types/slot.type";
import { useFloors } from "@/features/floors/hooks/use-floors";
import { SlotStatusBadge } from "./slot-status-badge";
import { useSessions } from "@/features/sessions/hooks/use-sessions";
import { useAllBookings } from "@/features/bookings/hooks/use-bookings";
import { format, parseISO } from "date-fns";

interface SlotDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: ParkingSlot | null;
}

// Mock customer info since backend doesn't provide it yet
const MOCK_CUSTOMERS = [
  { name: "Nguyễn Văn A", phone: "0901 234 567", plate: "51F-123.45" },
  { name: "Trần Thị B", phone: "0912 345 678", plate: "59C1-456.78" },
  { name: "Lê Hoàng C", phone: "0923 456 789", plate: "51G-789.12" },
  { name: "Phạm Minh D", phone: "0934 567 890", plate: "60A1-012.34" },
];

export function SlotDetailDialog({
  open,
  onClose,
  data,
}: SlotDetailDialogProps) {
  const { data: floors = [] } = useFloors();
  const { data: sessionsResponse } = useSessions();
  const { data: bookings = [] } = useAllBookings();
  
  if (!open || !data) return null;

  const floor = floors.find((f: any) => f.id === data.floorId);
  const sessions = sessionsResponse?.data || [];

  // Find active session or booking
  const activeSession = sessions.find((s: any) => s.parkingSlotId === data.id && s.status === 'IN_PROGRESS');
  const activeBooking = bookings.find((b: any) => b.parkingSlotId === data.id && (b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'));

  // Use mock data for demo purposes if session/booking found
  const mockCustomer = MOCK_CUSTOMERS[data.id % MOCK_CUSTOMERS.length];
  
  let customerInfo = null;
  if (data.status === 'OCCUPIED' && activeSession) {
    customerInfo = {
      name: "Khách vãng lai", // Or mock name
      phone: "N/A",
      plate: activeSession.plate || "Chưa cập nhật",
      time: activeSession.timeIn,
      timeLabel: "Thời gian vào",
    };
  } else if (data.status === 'RESERVED' && activeBooking) {
    customerInfo = {
      name: mockCustomer.name,
      phone: mockCustomer.phone,
      plate: mockCustomer.plate,
      time: activeBooking.expectedTimeIn,
      timeLabel: "Dự kiến vào",
    };
  } else if (data.status === 'OCCUPIED' || data.status === 'RESERVED') {
    // Fallback if no session/booking found but status is occupied/reserved
    customerInfo = {
      name: data.status === 'RESERVED' ? mockCustomer.name : "Khách vãng lai",
      phone: data.status === 'RESERVED' ? mockCustomer.phone : "N/A",
      plate: data.status === 'OCCUPIED' ? mockCustomer.plate : "Chưa cập nhật",
    };
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

        <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
          <div className="mb-4">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Chi tiết vị trí đỗ
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Thông tin chi tiết về vị trí đỗ xe.
            </p>
          </div>

          <div className="space-y-4 py-4">
            {/* Tên / Mã Slot */}
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Tên / Mã:</span>
              <span className="col-span-2 font-medium">{data.slotName}</span>
            </div>
            
            {/* Trạng thái Slot */}
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
              <div className="col-span-2">
                <SlotStatusBadge status={data.status} />
              </div>
            </div>
            
            {/* Tầng */}
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Tầng:</span>
              <span className="col-span-2">{floor ? floor.floorName : "Không xác định"}</span>
            </div>
            
            {/* Tòa nhà */}
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Tòa nhà:</span>
              <span className="col-span-2">{floor && floor.buildingName ? floor.buildingName : "Không xác định"}</span>
            </div>

            {/* Thông tin khách hàng nếu đang có xe đỗ hoặc đã đặt trước */}
            {customerInfo && (
              <>
                <div className="my-2 border-t border-border" />
                <h3 className="text-sm font-semibold mb-2">Thông tin khách hàng</h3>
                
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Khách hàng:</span>
                  <span className="col-span-2 font-medium">{customerInfo.name}</span>
                </div>
                
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">SĐT:</span>
                  <span className="col-span-2">{customerInfo.phone}</span>
                </div>
                
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Biển số:</span>
                  <span className="col-span-2 font-medium text-blue-600 dark:text-blue-400">
                    {customerInfo.plate}
                  </span>
                </div>

                {customerInfo.time && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">{customerInfo.timeLabel}:</span>
                    <span className="col-span-2">
                      {format(parseISO(customerInfo.time), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
