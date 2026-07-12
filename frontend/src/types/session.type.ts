export interface SessionResponse {
  id: number;
  ticketCode: string;
  timeIn: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  plate: string;
  vehicleId: number | null;
  parkingSlotId: number | null;
  message: string | null;
}

export interface SessionListResponse {
  totalItems: number;
  data: SessionResponse[];
  message: string;
}
