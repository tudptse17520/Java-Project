"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LogOut
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ADMIN_NAV, MANAGER_NAV, STAFF_NAV } from "@/config/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { removeCookie } from "@/utils/storage";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = () => {
    removeCookie("access_token");
    clearUser();
    router.replace("/login");
  };

  // Xác định base path dựa trên URL hiện tại (vd: /admin, /manager, /staff)
  const firstSegment = pathname.split('/')[1];
  const basePath = ["admin", "manager", "staff"].includes(firstSegment) ? `/${firstSegment}` : "/admin";

  const navGroups =
    basePath === "/admin" ? ADMIN_NAV :
      basePath === "/manager" ? MANAGER_NAV :
        STAFF_NAV;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-sidebar md:flex",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link href={`${basePath}/dashboard`} className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
            {basePath === "/admin" ? "PBMS Admin" : basePath === "/manager" ? "PBMS Manager" : "PBMS Staff"}
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="px-4">
          {navGroups.map((group, index) => (
            <div key={index} className={cn("mb-4", index > 0 && "pt-2")}>
              <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </h4>
              <div className="grid gap-1">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link key={itemIndex} href={item.href}>
                      <span
                        className={cn(
                          "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-sidebar-foreground"
                        )}
                      >
                        <div className="flex items-center">
                          <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-sidebar-foreground/70")} />
                          {item.title}
                        </div>
                        {item.title === "Sự cố" && (
                          <span className="flex h-5 items-center justify-center rounded-full bg-rose-500/15 px-1.5 text-[11px] font-bold text-rose-500 min-w-5">
                            2
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
}
