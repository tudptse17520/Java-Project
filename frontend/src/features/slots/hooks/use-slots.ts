import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slotService } from '@/services/slot.service';

export const useSlots = (floorId?: number) => {
  return useQuery({
    queryKey: ['slots', floorId],
    queryFn: () => slotService.getSlots(floorId),
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