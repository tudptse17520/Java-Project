import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { ChangePasswordFormValues } from "../schemas/change-password.schema";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { useActivityStore } from "@/stores/activity.store";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormValues) => authService.changePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Đổi mật khẩu thành công!");

      // Add to activity log
      const { user } = useAuthStore.getState();
      const actorName = user?.fullName || user?.username || "Tài khoản";
      
      useActivityStore.getState().addActivity({
        type: "security",
        title: `${actorName} đã thay đổi mật khẩu`,
        icon: "ShieldAlert",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    },
  });
};
