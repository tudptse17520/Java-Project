// ---------------------------------------------
// Sidebar
// Premium sidebar navigation cho Dashboard layout
// ---------------------------------------------

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ParkingSquare, ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { getNavGroupsByRole } from "@/config/menu";
import { type Role } from "@/constants/role";
import { removeCookie } from "@/utils/storage";

interface SidebarProps {
  role?: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();

  const activeRole = role || (user?.role as Role);
  const navGroups = activeRole ? getNavGroupsByRole(activeRole) : [];

  const handleLogout = () => {
    removeCookie("access_token");
    useAuthStore.getState().clearUser();
    window.location.href = "/login";
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 ease-in-out",
        isSidebarOpen ? "w-64" : "w-[68px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ParkingSquare className="h-4 w-4" />
          </div>
          {isSidebarOpen && (
            <span className="text-base font-bold tracking-tight text-sidebar-foreground truncate">
              PBMS
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200"
          aria-label={isSidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              !isSidebarOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && "mt-6")}>
            {isSidebarOpen && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-foreground/40">
                {group.label}
              </p>
            )}
            {!isSidebarOpen && groupIndex > 0 && (
              <div className="mx-3 mb-3 border-t border-sidebar-border" />
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-px"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                      title={item.title}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-primary" : "text-sidebar-foreground/50"
                      )} />
                      {isSidebarOpen && <span className="truncate">{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom section — User & Logout */}
      <div className="border-t border-sidebar-border p-3">
        {user && isSidebarOpen && (
          <div className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.fullName || user.username}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50">
                {user.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
