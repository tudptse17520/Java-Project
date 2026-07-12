import { ColumnDef } from '@tanstack/react-table';
import { BookingListResponse } from '@/features/bookings/types/booking.type';

export const columns: ColumnDef<BookingListResponse>[] = [
  { header: 'Khách hàng', accessorKey: 'customerName' },
  { header: 'Vị trí', accessorKey: 'slotName' },
  { header: 'Trạng thái', accessorKey: 'status' },
  { header: 'Thời gian', accessorKey: 'startTime' },
];