"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ParkingSquare, Moon, Sun, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { getDriverNavItems } from "@/config/menu";
import { removeCookie } from "@/utils/storage";
import { Button } from "@/components/ui/button";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navItems = getDriverNavItems();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    removeCookie("access_token");
    useAuthStore.getState().clearUser();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar — Glass effect */}
      <nav className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-none items-center justify-between px-4 sm:px-10">
          {/* Logo */}
          <Link href="/browse" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ParkingSquare className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight">PBMS</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
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

            {user && (
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
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

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-none p-4 sm:p-10">{children}</main>
    </div>
  );
}
