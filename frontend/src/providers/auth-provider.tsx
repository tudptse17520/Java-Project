// ---------------------------------------------
// Auth Provider
// Trích xuất dữ liệu từ Cookie đồng bộ vào Zustand khi tải trang đầu
// ---------------------------------------------

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { getCookie } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";

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
        // Decode JWT payload an toàn bằng jwt-decode
        interface DecodedPayload { sub?: string; role?: string }
        const payload = jwtDecode<DecodedPayload>(token);
        setUser({
          username: payload.sub || "",
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
