// ---------------------------------------------
// Sidebar
// Khung Sidebar navigation cho Dashboard layout
// Skeleton - sẽ triển khai chi tiết khi có business feature
// ---------------------------------------------

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ParkingSquare, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { getNavGroupsByRole } from "@/config/menu";
import { type Role } from "@/constants/role";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();

  const navGroups = user
    ? getNavGroupsByRole(user.role as Role)
    : [];

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <ParkingSquare className="h-6 w-6 text-sidebar-primary" />
          {isSidebarOpen && (
            <span className="text-lg font-bold text-sidebar-foreground">
              PBMS
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1 hover:bg-sidebar-accent"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 text-sidebar-foreground transition-transform",
              !isSidebarOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {isSidebarOpen && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                      title={item.title}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {isSidebarOpen && <span>{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
