"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Shield, Briefcase, UserCheck, User, Lock, LogIn, Store } from "lucide-react";

import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { useLogin } from "../hooks/use-login";
import { setCookie } from "@/utils/storage";
import { Role } from "@/constants/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Trả về đường dẫn redirect dựa trên role từ API response.
 */
function getRedirectPathByRole(role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER'): string {
  switch (role) {
    case Role.ADMIN:
      return "/admin/dashboard";
    case Role.MANAGER:
      return "/manager/dashboard";
    case Role.STAFF:
      return "/staff/dashboard";
    case Role.USER:
      return "/browse";
    default:
      return "/";
  }
}

export function LoginForm() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (res) => {
        // Lưu token vào cookie thông qua abstraction của storage.ts
        // AuthProvider sẽ tự decode JWT và đồng bộ vào Zustand store khi trang mới được tải
        setCookie("access_token", res.token);

        toast.success(res.message || "Đăng nhập thành công");

        // Điều hướng dựa trên role từ API response
        router.push(getRedirectPathByRole(res.role));
      },
      onError: (error) => {
        const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
        toast.error(message);
      },
    });
  };

  // Đăng nhập nhanh bằng tài khoản có thật (thực hiện call API login thực tế)
  const handleQuickLogin = (role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER') => {
    // TODO: Chỉnh sửa lại các thông tin username và password dưới đây 
    // sao cho khớp chính xác với dữ liệu (seed data) đang có trong database của backend.
    const credentials = {
      ADMIN: { username: "admin", password: "password" },
      MANAGER: { username: "manager", password: "password" },
      STAFF: { username: "staff", password: "password" },
      USER: { username: "user", password: "password" },
    };

    const { username, password } = credentials[role];

    // Gọi API đăng nhập thực tế thay vì mock token
    login(
      { username, password },
      {
        onSuccess: (res) => {
          setCookie("access_token", res.token);
          toast.success(res.message || `Đăng nhập nhanh với quyền ${role} thành công!`);
          router.push(getRedirectPathByRole(res.role));
        },
        onError: (error) => {
          const message = error.response?.data?.message || `Tài khoản mặc định cho ${role} chưa đúng. Vui lòng cập nhật lại credentials trong mã nguồn.`;
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="w-full rounded-[28px] border border-border/40 bg-card/90 p-8 md:p-10 shadow-xl backdrop-blur-xl animate-scale-in max-w-[440px] mx-auto">
      {/* Logo & Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 text-indigo-600 dark:text-indigo-400">
          <Store className="h-16 w-16 stroke-[1.25]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Đăng nhập
        </h1>
        <p className="mt-2.5 text-sm text-muted-foreground/90 leading-relaxed">
          Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <User className="h-4 w-4 text-slate-400" />
            <span>Tên đăng nhập</span>
          </Label>
          <Input
            id="username"
            placeholder="Nhập tên đăng nhập"
            autoComplete="username"
            {...form.register("username")}
            disabled={isPending}
            className="h-11 rounded-xl"
          />
          {form.formState.errors.username && (
            <p className="text-xs text-destructive mt-1.5">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Lock className="h-4 w-4 text-slate-400" />
            <span>Mật khẩu</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              className="pr-11 h-11 rounded-xl"
              {...form.register("password")}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors duration-200"
              tabIndex={-1}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-destructive mt-1.5">
              {form.formState.errors.password.message}
            </p>
          )}
          
          {/* Forgot Password Link */}
          <span 
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer block text-right mt-2"
            onClick={() => toast("Tính năng khôi phục mật khẩu đang được phát triển.")}
          >
            Quên mật khẩu?
          </span>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 font-semibold gap-2 transition-all active:scale-[0.98]"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </>
          )}
        </Button>
      </form>

      {/* Quick Login Section */}
      <div className="mt-6">
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-border/40"></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-muted-foreground/60">
            Đăng nhập nhanh với vai trò
          </span>
          <div className="flex-grow border-t border-border/40"></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickLogin("ADMIN")}
            className="rounded-full px-4 border-rose-500 text-rose-600 hover:bg-rose-500/10 dark:border-rose-500/40 dark:text-rose-400 dark:hover:bg-rose-500/20 text-xs h-9 font-medium gap-1.5 transition-all"
          >
            <Shield className="h-3.5 w-3.5" />
            Admin
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickLogin("MANAGER")}
            className="rounded-full px-4 border-amber-500 text-amber-600 hover:bg-amber-500/10 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-500/20 text-xs h-9 font-medium gap-1.5 transition-all"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Quản lý
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickLogin("STAFF")}
            className="rounded-full px-4 border-sky-500 text-sky-600 hover:bg-sky-500/10 dark:border-sky-500/40 dark:text-sky-400 dark:hover:bg-sky-500/20 text-xs h-9 font-medium gap-1.5 transition-all"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Nhân viên
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickLogin("USER")}
            className="rounded-full px-4 border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-500/20 text-xs h-9 font-medium gap-1.5 transition-all"
          >
            <User className="h-3.5 w-3.5" />
            Khách hàng
          </Button>
        </div>
      </div>

      {/* Footer Registration Link */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <span>Chưa có tài khoản? </span>
        <span 
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
          onClick={() => toast("Tính năng đăng ký tài khoản mới đang được phát triển.")}
        >
          Đăng ký ngay
        </span>
      </div>
    </div>
  );
}
