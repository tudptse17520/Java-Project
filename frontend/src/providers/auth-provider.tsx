// ---------------------------------------------
// Auth Provider
// Trích xuất dữ liệu từ Cookie đồng bộ vào Zustand khi tải trang đầu
// ---------------------------------------------

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { getCookie } from "@/utils/storage";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Kiểm tra token trong cookie khi tải trang
    const token = getCookie("access_token");

    if (token) {
      try {
        // Decode JWT payload (base64) để lấy thông tin user
        // Placeholder: sẽ triển khai chi tiết khi có API
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.sub || "",
          email: payload.email || "",
          fullName: payload.fullName || "",
          role: payload.role || "USER",
        });
      } catch {
        // Token không hợp lệ
        clearUser();
      }
    } else {
      clearUser();
    }
  }, [setUser, clearUser]);

  return <>{children}</>;
}
