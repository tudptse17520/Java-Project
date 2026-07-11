import  axiosClient  from '@/lib/axios-client';
import { ParkingSlot, CreateSlotDto } from '@/features/slots/types/slot.type';

export const slotService = {
  getSlots: async (floorId?: number, status?: string) => {
    const response = await axiosClient.get<{ totalAvailable: number; data: ParkingSlot[] }>('/slots', { params: { floor_id: floorId, status } });
    return response.data;
  },
  createSlot: async (data: CreateSlotDto) => {
    const response = await axiosClient.post('/slots', data);
    return response.data;
  },
  updateSlotStatus: async (id: number, status: string) => {
    const response = await axiosClient.patch(`/slots/${id}/status`, { status });
    return response.data;
  }
};