import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBuildings,
  getBuildingDetail,
  createBuilding,
  updateBuilding,
  updateBuildingStatus,
} from '@/services/building.service';
import type { BuildingCreateForm, BuildingUpdateForm } from '../schemas/building-form.schema';

export const useBuildings = (keyword?: string, status?: string) => {
  return useQuery({
    queryKey: ['buildings', keyword, status],
    queryFn: () => getBuildings(keyword, status),
  });
};

export const useBuildingDetail = (id: number) => {
  return useQuery({
    queryKey: ['building', id],
    queryFn: () => getBuildingDetail(id),
    enabled: !!id,
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BuildingCreateForm) => createBuilding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BuildingUpdateForm }) => updateBuilding(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
    },
  });
};

export const useUpdateBuildingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateBuildingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
    },
  });
};
