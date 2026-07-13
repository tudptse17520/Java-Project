// ---------------------------------------------
// Auth Provider
// Trích xuất dữ liệu từ Cookie đồng bộ vào Zustand khi tải trang đầu
// ---------------------------------------------

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { getCookie } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/services/auth.service";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie("access_token");

      if (token) {
        try {
          // Decode JWT payload an toàn bằng jwt-decode để check expiration hoặc format cơ bản
          interface DecodedPayload { sub?: string; role?: string }
          jwtDecode<DecodedPayload>(token);

          // Lấy thông tin user đầy đủ từ API
          const user = await authService.getMe();
          setUser(user);
        } catch {
          // Token không hợp lệ hoặc API lỗi (có thể do token hết hạn)
          clearUser();
        }
      } else {
        clearUser();
      }
    };

    fetchUser();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
