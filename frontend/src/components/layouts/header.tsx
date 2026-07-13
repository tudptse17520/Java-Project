// ---------------------------------------------
// Header
// Thanh header trên cùng cho Dashboard layout
// Glass effect + sticky + modern design
// ---------------------------------------------

"use client";

import { Moon, Sun, Bell, Car } from "lucide-react";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layouts/breadcrumbs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Header() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Occupancy Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <Car className="h-4 w-4" />
          <span className="text-xs font-semibold">Tải bãi: 72%</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-lg"
            />
          }>
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 border-2 border-background"></span>
          </TooltipTrigger>
          <TooltipContent>Thông báo</TooltipContent>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-lg"
            />
          }>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </TooltipTrigger>
          <TooltipContent>{theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}</TooltipContent>
        </Tooltip>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20">
              <span className="text-xs font-semibold">
                {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden text-sm font-medium sm:inline">
              {user.fullName || user.username}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
