// ---------------------------------------------
// Theme Store
// Trạng thái giao diện Sáng / Tối / Hệ thống
// Chỉ lưu Client State - KHÔNG lưu Server State
// ---------------------------------------------

import { create } from "zustand";
import { getStorageItem, setStorageItem } from "@/utils/storage";

type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "pbms-theme";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getStorageItem<Theme>(THEME_STORAGE_KEY, "system"),

  setTheme: (theme) => {
    setStorageItem(THEME_STORAGE_KEY, theme);
    set({ theme });
  },
}));
