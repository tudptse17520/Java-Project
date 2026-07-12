import axiosClient from "@/lib/axios-client";
import type { SessionListResponse, SessionFilterParams } from "@/features/sessions/types/session.type";

const SESSION_API_URL = "/api/v1/sessions";

export const getSessions = async (params?: SessionFilterParams): Promise<SessionListResponse> => {
  let formattedDate = undefined;
  if (params?.fromDate) {
    // Assuming params.fromDate is YYYY-MM-DD from <input type="date">
    formattedDate = `${params.fromDate}T00:00:00`;
  }

  const response = await axiosClient.get<SessionListResponse>(SESSION_API_URL, {
    params: {
      plate: params?.plate || undefined,
      status: params?.status && params.status !== "ALL" ? params.status : undefined,
      from_date: formattedDate,
    },
  });
  return response.data;
};
