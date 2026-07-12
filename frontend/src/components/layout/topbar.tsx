"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, 
  Building2,
  Menu,
  Moon,
  Sun
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/stores/theme.store";
import { ADMIN_NAV, MANAGER_NAV, STAFF_NAV } from "@/config/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { removeCookie } from "@/utils/storage";

import { useState } from "react";
import { ProfileDialog } from "./profile-dialog";
import { SettingsDialog } from "./settings-dialog";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const { setTheme, theme } = useThemeStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    removeCookie("access_token");
    clearUser();
    router.replace("/login");
  };

  const firstSegment = pathname.split('/')[1];
  const basePath = ["admin", "manager", "staff"].includes(firstSegment) ? `/${firstSegment}` : "/admin";

  const navGroups = 
    basePath === "/admin" ? ADMIN_NAV :
    basePath === "/manager" ? MANAGER_NAV : 
    STAFF_NAV;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
        <div className="flex items-center gap-4 md:hidden">
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetTitle className="sr-only">Menu Điều Hướng</SheetTitle>
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
                    <div key={index} className="mb-4">
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
                                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                  isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-sidebar-foreground"
                                )}
                              >
                                <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-sidebar-foreground/70")} />
                                {item.title}
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
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex w-full items-center justify-end gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Info */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" className="relative h-10 w-10 rounded-full md:h-auto md:w-auto md:px-2 md:py-1.5 md:flex md:gap-2" />
            }>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/admin.png" alt="@user" />
                <AvatarFallback>{basePath.replace('/', '').substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium capitalize">{basePath.replace('/', '')} User</span>
                <span className="text-xs text-muted-foreground capitalize">System {basePath.replace('/', '')}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{basePath.replace('/', '')} User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {basePath.replace('/', '')}@pbms.ut.edu.vn
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                Hồ sơ cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                Cài đặt tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ProfileDialog isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
