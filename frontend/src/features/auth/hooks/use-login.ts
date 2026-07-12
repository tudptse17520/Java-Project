import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/login.type";
import type { ApiErrorResponse } from "@/types/api";
import type { AxiosError } from "axios";

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError<ApiErrorResponse>, LoginRequest>({
    mutationFn: (data: LoginRequest) => authService.login(data),
  });
};
