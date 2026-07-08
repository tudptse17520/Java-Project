// ---------------------------------------------
// Auth Store
// Trạng thái phiên đăng nhập của người dùng hiện tại
// Chỉ lưu Client State - KHÔNG lưu Server State
// ---------------------------------------------

import { create } from "zustand";
import type { Role } from "@/constants/role";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role | string;
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
