// ---------------------------------------------
// App Store
// Trạng thái đóng/mở Sidebar, kích thước màn hình
// Chỉ lưu Client State - KHÔNG lưu Server State
// ---------------------------------------------

import { create } from "zustand";

interface AppState {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  isMobile: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setIsMobile: (isMobile) =>
    set({
      isMobile,
      // Tự động đóng sidebar trên mobile
      isSidebarOpen: !isMobile,
    }),
}));
