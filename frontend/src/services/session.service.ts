import axiosClient from "@/lib/axios-client";
import { ApiResponse } from "@/types/api";

import {
  CheckOutRequest,
  CheckOutResponse,
  FeeCalculationResponse,
  LostTicketRequest,
  OverrideCheckoutRequest,
  ParkingSession,
  PlateValidationRequest,
} from "@/features/sessions/types/session.type";

export const sessionService = {
  getParkingSessions: async (params?: {
    plate?: string;
    status?: string;
    from_date?: string;
  }): Promise<{ totalItems: number; data: ParkingSession[] }> => {
    const { data } = await axiosClient.get<{ totalItems: number; data: ParkingSession[] }>("/sessions", {
      params,
    });
    return data;
  },

  validatePlate: async (
    sessionId: number,
    request: PlateValidationRequest
  ): Promise<{ message: string }> => {
    const { data } = await axiosClient.post<{ message: string }>(
      `/sessions/${sessionId}/validate-plate`,
      request
    );
    return data;
  },

  overrideCheckout: async (
    sessionId: number,
    request: OverrideCheckoutRequest
  ): Promise<CheckOutResponse> => {
    const { data } = await axiosClient.post<CheckOutResponse>(
      `/sessions/${sessionId}/override-checkout`,
      request
    );
    return data;
  },

  lostTicket: async (
    sessionId: number,
    request: LostTicketRequest
  ): Promise<FeeCalculationResponse> => {
    const { data } = await axiosClient.post<FeeCalculationResponse>(
      `/sessions/${sessionId}/lost-ticket`,
      request
    );
    return data;
  },

  calculateFee: async (sessionId: number): Promise<FeeCalculationResponse> => {
    const { data } = await axiosClient.post<FeeCalculationResponse>(
      `/sessions/${sessionId}/calculate-fee`
    );
    return data;
  },

  checkExitGate: async (sessionId: number): Promise<{ message: string }> => {
    const { data } = await axiosClient.post<{ message: string }>(
      `/sessions/${sessionId}/exit-gate`
    );
    return data;
  },

  checkOut: async (
    sessionId: number,
    request: CheckOutRequest
  ): Promise<CheckOutResponse> => {
    const { data } = await axiosClient.put<CheckOutResponse>(
      `/sessions/${sessionId}/check-out`,
      request
    );
    return data;
  },
};
