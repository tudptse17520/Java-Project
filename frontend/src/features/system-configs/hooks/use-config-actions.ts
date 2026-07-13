import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configService } from "@/services/config.service";
import { CONFIG_QUERY_KEYS } from "../constants/config.constants";
import { SystemConfigRequest } from "../types/config.type";
import { useAuthStore } from "@/stores/auth.store";
import { useActivityStore } from "@/stores/activity.store";

export const useConfigActions = () => {
  const queryClient = useQueryClient();

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: SystemConfigRequest }) =>
      configService.updateConfiguration(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEYS.all });
      
      const { user } = useAuthStore.getState();
      const actorName = user?.fullName || user?.username || "Admin";
      
      useActivityStore.getState().addActivity({
        type: "update_config",
        title: `${actorName} cập nhật cấu hình hệ thống`,
        icon: "Settings",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      });
    },
  });

  return {
    updateConfigMutation,
  };
};
