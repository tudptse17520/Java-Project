import axiosClient from "@/lib/axios-client";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/login.type";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/v1/auth/login", data);
    return response.data;
  },
};
