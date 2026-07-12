import axiosClient from '@/lib/axios-client';
import { SessionListResponse, SessionResponse } from '@/types/session.type';

const SESSION_API = '/sessions';

export const sessionService = {
  getSessions: async (keyword?: string, status?: string): Promise<SessionListResponse> => {
    const params = new URLSearchParams();
    if (keyword) params.append('plate', keyword);
    if (status && status !== 'ALL') params.append('status', status);
    
    const response = await axiosClient.get<SessionListResponse>(SESSION_API, { params });
    return response.data;
  },

  checkInVehicle: async (data: { plate: string; vehicleId?: number | null; parkingSlotId?: number | null }): Promise<SessionResponse> => {
    const response = await axiosClient.post<SessionResponse>(`${SESSION_API}/check-in`, data);
    return response.data;
  },

  updateSession: async (id: number, data: { plate: string; vehicleId?: number | null; parkingSlotId?: number | null }): Promise<SessionResponse> => {
    const response = await axiosClient.put<SessionResponse>(`${SESSION_API}/${id}`, data);
    return response.data;
  },

  updateSessionStatus: async (id: number, status: string): Promise<SessionResponse> => {
    const response = await axiosClient.patch<SessionResponse>(`${SESSION_API}/${id}/status`, { status });
    return response.data;
  }
};
