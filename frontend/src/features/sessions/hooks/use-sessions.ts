import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services/session.service';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useSessions = (keyword?: string, status?: string) => {
  return useQuery({
    queryKey: ['sessions', keyword, status],
    queryFn: () => sessionService.getSessions(keyword, status),
  });
};

export const useCheckInVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sessionService.checkInVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Check-in xe thành công');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi check-in');
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { plate: string; vehicleId?: number | null; parkingSlotId?: number | null } }) => 
      sessionService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Cập nhật lượt gửi xe thành công');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    },
  });
};

export const useUpdateSessionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      sessionService.updateSessionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });
};
