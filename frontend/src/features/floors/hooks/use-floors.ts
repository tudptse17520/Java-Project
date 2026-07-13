import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { floorService } from '@/services/floor.service';
import type { FloorFormValues } from '../schemas/floor.schema';

import toast from "react-hot-toast";

export const useFloors = () => {
  return useQuery({
    queryKey: ['floors'],
    queryFn: () => floorService.getAll(),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
};

export const useFloorsByBuilding = (buildingId?: number) => {
  return useQuery({
    queryKey: ['floors', 'building', buildingId],
    queryFn: () => floorService.getByBuilding(buildingId!),
    enabled: !!buildingId,
  });
};

export const useFloorDetail = (id: number) => {
  return useQuery({
    queryKey: ['floor', id],
    queryFn: () => floorService.getById(id),
    enabled: !!id,
  });
};

export const useCreateFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FloorFormValues) => floorService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success(`Thêm tầng "${variables.floorName}" thành công!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Thêm tầng thất bại");
    }
  });
};

export const useUpdateFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FloorFormValues }) => floorService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success(`Cập nhật tầng "${variables.data.floorName}" thành công!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật tầng thất bại");
    }
  });
};

export const useDeleteFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, floorName }: { id: number; floorName: string }) => floorService.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success(`Xóa tầng "${variables.floorName}" thành công!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa tầng thất bại");
    }
  });
};
