// ---------------------------------------------
// Header
// Thanh header trên cùng cho Dashboard layout
// Glass effect + sticky + modern design
// ---------------------------------------------

"use client";

import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layouts/breadcrumbs";

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
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-lg"
          aria-label={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

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
