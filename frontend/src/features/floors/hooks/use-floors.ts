import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { floorService } from '@/services/floor.service';
import type { FloorFormValues } from '../schemas/floor.schema';

export const useFloors = () => {
  return useQuery({
    queryKey: ['floors'],
    queryFn: () => floorService.getAll(),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
    },
  });
};

export const useUpdateFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FloorFormValues }) => floorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
    },
  });
};

export const useDeleteFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => floorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
    },
  });
};
