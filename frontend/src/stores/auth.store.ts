// ---------------------------------------------
// Auth Store
// Trạng thái phiên đăng nhập của người dùng hiện tại
// Chỉ lưu Client State - KHÔNG lưu Server State
// ---------------------------------------------

import { create } from "zustand";
import type { Role } from "@/constants/role";

export interface AuthUser {
  username: string;
  role: Role | string;
  // TODO: Các trường sau cần API GET /api/v1/auth/me để populate đầy đủ
  id?: number;
  fullName?: string;
  phoneNumber?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
