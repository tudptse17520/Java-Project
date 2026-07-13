import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slotService } from '@/services/slot.service';
import type { CreateSlotDto } from '../types/slot.type';

import toast from "react-hot-toast";

export const useSlots = (floorId?: number, status?: string) => {
  return useQuery({
    queryKey: ['slots', floorId, status],
    queryFn: () => slotService.getSlots(floorId, status),
    refetchInterval: 5000,
  });
};

export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSlotDto) => slotService.createSlot(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success(`Thêm ô đỗ "${variables.slotName}" thành công!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Thêm ô đỗ thất bại");
    }
  });
};

export const useUpdateSlotStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, slotName }: { id: number; status: string; slotName?: string }) => 
      slotService.updateSlotStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      const nameStr = variables.slotName ? ` "${variables.slotName}"` : "";
      toast.success(`Cập nhật trạng thái ô đỗ${nameStr} thành công!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái ô đỗ thất bại");
    }
  });
};

export const useUpdateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateSlotDto }) => 
      slotService.updateSlot(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success(`Cập nhật thông tin ô đỗ "${variables.data.slotName}" thành công!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thông tin ô đỗ thất bại");
    }
  });
};

export const useDeleteSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => slotService.deleteSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success(`Xóa ô đỗ thành công!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa ô đỗ thất bại");
    }
  });
};