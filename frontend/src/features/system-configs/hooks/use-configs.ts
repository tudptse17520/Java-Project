import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config.service";
import { CONFIG_QUERY_KEYS } from "../constants/config.constants";

interface UseConfigsParams {
  keyword?: string;
  enabled?: boolean;
}

export const useConfigs = ({ keyword, enabled = true }: UseConfigsParams = {}) => {
  return useQuery({
    queryKey: CONFIG_QUERY_KEYS.list({ keyword }),
    queryFn: () => configService.getConfigurations(keyword),
    enabled,
  });
};
