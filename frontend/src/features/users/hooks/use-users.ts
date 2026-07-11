import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
} from "@/services/user.service";
import {
  UserResponse,
  UserListResponse,
  UserCreatePayload,
  UserUpdatePayload,
} from "@/types/user.type";
import toast from "react-hot-toast";

export const USERS_QUERY_KEY = ["users"];

export const useUsers = (keyword?: string, role?: string) => {
  return useQuery<UserListResponse, AxiosError<ApiErrorResponse>>({
    queryKey: [...USERS_QUERY_KEY, keyword, role],
    queryFn: () => getUsers(keyword, role),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, AxiosError<ApiErrorResponse>, UserCreatePayload>({
    mutationFn: (data) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Thêm thành viên thành công!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Thêm thành viên thất bại!");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    AxiosError<ApiErrorResponse>,
    { id: number; data: UserUpdatePayload }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    AxiosError<ApiErrorResponse>,
    { id: number; status: string }
  >({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại!");
    },
  });
};
