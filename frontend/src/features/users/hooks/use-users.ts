import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { useActivityStore } from "@/stores/activity.store";
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

export const useUsers = (keyword?: string, role?: string, status?: string) => {
  return useQuery<UserListResponse, AxiosError<ApiErrorResponse>>({
    queryKey: [...USERS_QUERY_KEY, keyword, role, status],
    queryFn: () => getUsers(keyword, role, status),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, AxiosError<ApiErrorResponse>, UserCreatePayload>({
    mutationFn: (data) => createUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Thêm thành viên thành công!");

      // Add to activity log
      const { user } = useAuthStore.getState();
      const actorName = user?.fullName || user?.username || "Admin";
      
      useActivityStore.getState().addActivity({
        type: "create_user",
        title: `${actorName} tạo tài khoản mới ${data.username}`,
        icon: "UserPlus",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Cập nhật thông tin thành công!");
      
      // Update auth store if the current user is updated
      const { user, setUser } = useAuthStore.getState();
      if (user && user.id === data.id) {
        setUser({ ...user, ...data });
      }

      // Add to activity log
      const actorName = user?.fullName || user?.username || "Admin";
      useActivityStore.getState().addActivity({
        type: "update_user",
        title: `${actorName} cập nhật thông tin tài khoản ${data.username}`,
        icon: "Edit",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Cập nhật trạng thái thành công!");

      const { user, setUser } = useAuthStore.getState();
      if (user && user.id === data.id) {
        setUser({ ...user, status: data.status });
      }

      // Add to activity log
      const actorName = user?.fullName || user?.username || "Admin";
      const isLocked = data.status === "INACTIVE";
      useActivityStore.getState().addActivity({
        type: "block_user",
        title: `${actorName} đã ${isLocked ? "khóa" : "mở khóa"} tài khoản ${data.username}`,
        icon: isLocked ? "UserMinus" : "UserPlus",
        color: isLocked ? "text-rose-500" : "text-emerald-500",
        bg: isLocked ? "bg-rose-500/10" : "bg-emerald-500/10",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại!");
    },
  });
};
