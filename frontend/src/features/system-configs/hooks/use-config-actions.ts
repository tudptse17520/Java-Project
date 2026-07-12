import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configService } from "@/services/config.service";
import { CONFIG_QUERY_KEYS } from "../constants/config.constants";
import { SystemConfigRequest } from "../types/config.type";

export const useConfigActions = () => {
  const queryClient = useQueryClient();

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: SystemConfigRequest }) =>
      configService.updateConfiguration(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEYS.all });
    },
  });

  return {
    updateConfigMutation,
  };
};
