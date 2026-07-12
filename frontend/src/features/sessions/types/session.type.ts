import { SessionStatus } from "@/constants/session-status";

export interface ParkingSession {
  id: number;
  plate: string;
  timeIn: string;
  timeOut: string | null;
  totalFee: number | null;
  status?: SessionStatus;
}

export interface PlateValidationRequest {
  plateOut: string;
  plateOutImage: string;
}

export interface OverrideCheckoutRequest {
  overrideReason: string;
}

export interface LostTicketRequest {
  note: string;
}

export interface CheckOutRequest {
  timeOut: string;
}

export interface FeeCalculationResponse {
  baseFee: number;
  overtimeFee: number;
  penaltyFee: number;
  totalFee: number;
  message: string;
}

export interface CheckOutResponse {
  sessionId: number;
  timeIn: string;
  timeOut: string;
  totalFee: number;
  status: SessionStatus;
  message: string;
}
