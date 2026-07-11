import axiosClient from "@/lib/axios-client";
import type { SessionListResponse, SessionFilterParams } from "@/features/sessions/types/session.type";

const SESSION_API_URL = "/api/v1/sessions";

export const getSessions = async (params?: SessionFilterParams): Promise<SessionListResponse> => {
  const response = await axiosClient.get<SessionListResponse>(SESSION_API_URL, {
    params: {
      plate: params?.plate || undefined,
      status: params?.status && params.status !== "ALL" ? params.status : undefined,
      from_date: params?.from_date || undefined,
    },
  });
  return response.data;
};
