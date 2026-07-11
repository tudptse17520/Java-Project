export interface BookingRequest {
  userId: number;
  vehicleId: number;
  parkingSlotId: number;
  expectedTimeIn: string; // ISO DateTime string or DD-MM-YYYY HH:mm:ss based on backend preference
  expectedTimeOut: string; 
}

export interface BookingResponse {
  id: number;
  status: string;
  message: string;
}

export interface BookingListResponse {
  booking_id: number;
  parking_slot_id: number;
  expected_time_in: string;
  status: string;
}

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
