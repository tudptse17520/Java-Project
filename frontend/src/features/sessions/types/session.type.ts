export interface SessionResponse {
  id: number;
  plate: string;
  time_in: string; // ISO 8601 string from backend LocalDateTime
  time_out?: string; // Optional, null if IN_PROGRESS
  total_fee?: number; // Optional, null if IN_PROGRESS
}

export interface SessionListResponse {
  total_items: number;
  data: SessionResponse[];
}

export interface SessionFilterParams {
  plate?: string;
  status?: string; // IN_PROGRESS, COMPLETED
  from_date?: string; // DD-MM-YYYY format according to some API docs, or maybe YYYY-MM-DD. Need to check API 4.5.
}
