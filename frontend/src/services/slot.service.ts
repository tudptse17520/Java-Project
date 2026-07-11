import  axiosClient  from '@/lib/axios-client';
import { ParkingSlot, CreateSlotDto } from '@/features/slots/types/slot.type';

export const slotService = {
  getSlots: async (floorId?: number, status?: string) => {
    return axiosClient.get<ParkingSlot[]>('/slots', { params: { floor_id: floorId, status } });
  },
  createSlot: async (data: CreateSlotDto) => {
    return axiosClient.post('/slots', data);
  },
  updateSlotStatus: async (id: number, status: string) => {
    return axiosClient.patch(`/slots/${id}/status`, { status });
  }
};