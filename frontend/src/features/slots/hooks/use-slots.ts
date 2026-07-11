import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slotService } from '@/services/slot.service';
import type { CreateSlotDto } from '../types/slot.type';

export const useSlots = (floorId?: number, status?: string) => {
  return useQuery({
    queryKey: ['slots', floorId, status],
    queryFn: () => slotService.getSlots(floorId, status),
  });
};

export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSlotDto) => slotService.createSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    }
  });
};

export const useUpdateSlotStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      slotService.updateSlotStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    }
  });
};