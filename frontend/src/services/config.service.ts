import axiosClient from "@/lib/axios-client";
import {
  SystemConfig,
  SystemConfigRequest,
  SystemConfigListResponse,
  SystemConfigUpdateResponse,
} from "@/features/system-configs/types/config.type";

export const configService = {
  getConfigurations: async (
    keyword?: string
  ): Promise<SystemConfigListResponse> => {
    const params = keyword ? { keyword } : undefined;
    const { data } = await axiosClient.get<SystemConfigListResponse>(
      "/configurations",
      { params }
    );
    return data;
  },

  updateConfiguration: async (
    id: number,
    request: SystemConfigRequest
  ): Promise<SystemConfigUpdateResponse> => {
    const { data } = await axiosClient.put<SystemConfigUpdateResponse>(
      `/configurations/${id}`,
      request
    );
    return data;
  },
};
