import axiosClient from "@/lib/axios-client";
import {
  UserResponse,
  UserListResponse,
  UserCreatePayload,
  UserUpdatePayload,
} from "@/types/user.type";

const BASE_PATH = "/users";

export const getUsers = async (
  keyword?: string,
  role?: string
): Promise<UserListResponse> => {
  const params: Record<string, string> = {};
  if (keyword) params.keyword = keyword;
  if (role) params.role = role;

  const response = await axiosClient.get<UserListResponse>(BASE_PATH, {
    params,
  });
  return response.data;
};

export const createUser = async (
  data: UserCreatePayload
): Promise<UserResponse> => {
  const response = await axiosClient.post<UserResponse>(BASE_PATH, data);
  return response.data;
};

export const updateUser = async (
  id: number,
  data: UserUpdatePayload
): Promise<UserResponse> => {
  const response = await axiosClient.put<UserResponse>(`${BASE_PATH}/${id}`, data);
  return response.data;
};

export const updateUserStatus = async (
  id: number,
  status: string
): Promise<UserResponse> => {
  const response = await axiosClient.patch<UserResponse>(`${BASE_PATH}/${id}/status`, {
    status,
  });
  return response.data;
};
