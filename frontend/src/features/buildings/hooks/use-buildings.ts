import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBuildings,
  getBuildingDetail,
  createBuilding,
  updateBuilding,
  updateBuildingStatus,
} from '@/services/building.service';
import type { BuildingCreateForm, BuildingUpdateForm } from '../schemas/building-form.schema';
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth.store";
import { useActivityStore } from "@/stores/activity.store";

export const useBuildings = (keyword?: string, status?: string) => {
  return useQuery({
    queryKey: ['buildings', keyword, status],
    queryFn: () => getBuildings(keyword, status),
    refetchInterval: 5000,
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success(`Thêm tòa nhà "${variables.buildingName}" thành công!`);

      const { user } = useAuthStore.getState();
      const actorName = user?.fullName || user?.username || "Admin";
      
      useActivityStore.getState().addActivity({
        type: "create_building",
        title: `${actorName} đã thêm tòa nhà mới ${variables.buildingName}`,
        icon: "BuildingPlus",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi thêm tòa nhà");
    }
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BuildingUpdateForm }) => updateBuilding(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success(`Cập nhật tòa nhà "${variables.data.buildingName}" thành công!`);

      const { user } = useAuthStore.getState();
      const actorName = user?.fullName || user?.username || "Admin";
      
      useActivityStore.getState().addActivity({
        type: "update_building",
        title: `${actorName} đã chỉnh sửa tòa nhà ${variables.data.buildingName}`,
        icon: "Edit",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật tòa nhà");
    }
  });
};

export const useUpdateBuildingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateBuildingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success("Cập nhật trạng thái tòa nhà thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    }
  });
};
