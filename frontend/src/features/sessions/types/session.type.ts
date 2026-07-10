import { SessionStatus } from "@/constants/session-status";

export interface ParkingSession {
  id: number;
  plate: string;
  time_in: string;
  time_out: string | null;
  total_fee: number | null;
  status?: SessionStatus;
}

export interface PlateValidationRequest {
  plate_out: string;
  plate_out_image: string;
}

export interface OverrideCheckoutRequest {
  override_reason: string;
}

export interface LostTicketRequest {
  note: string;
}

export interface CheckOutRequest {
  time_out?: string;
}

export interface FeeCalculationResponse {
  base_fee: number;
  overtime_fee: number;
  penalty_fee: number;
  total_fee: number;
  message: string;
}

export interface CheckOutResponse {
  session_id: number;
  time_in: string;
  time_out: string;
  total_fee: number;
  status: SessionStatus;
  message: string;
}
