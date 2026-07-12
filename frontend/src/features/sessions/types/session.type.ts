export interface SessionResponse {
  id: number;
  plate: string;
  timeIn: string; // ISO 8601 string from backend LocalDateTime
  timeOut?: string; // Optional, null if IN_PROGRESS
  totalFee?: number; // Optional, null if IN_PROGRESS
}

export interface SessionListResponse {
  totalItems: number;
  data: SessionResponse[];
}

export interface SessionFilterParams {
  plate?: string;
  status?: string; // IN_PROGRESS, COMPLETED
  fromDate?: string; // Will be formatted to DD-MM-YYYY before API call
}
