export interface Booking {
  id: string;
  customerName: string;
  slotName: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  startTime: string;
  endTime: string;
}

export interface BookingResponse {
  data: Booking[];
}