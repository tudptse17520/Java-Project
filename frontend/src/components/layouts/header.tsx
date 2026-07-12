// ---------------------------------------------
// Header
// Thanh header trên cùng cho Dashboard layout
// Skeleton - sẽ triển khai chi tiết khi có business feature
// ---------------------------------------------

"use client";

import { Menu, Moon, Sun, LogOut, UserCircle } from "lucide-react";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layouts/breadcrumbs";
import { removeCookie } from "@/utils/storage";

export function Header() {
  const { toggleSidebar } = useAppStore();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    removeCookie("access_token");
    useAuthStore.getState().clearUser();
    window.location.href = "/login";
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Breadcrumbs />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-full border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/default-avatar.png"
                alt="User Avatar"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user.fullName || user.username || "User"
                  )}`;
                }}
              />
            </div>
            <span className="hidden text-sm font-medium sm:inline">
              {user.fullName || user.username}
            </span>
          </div>
        )}

        {/* Logout */}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
