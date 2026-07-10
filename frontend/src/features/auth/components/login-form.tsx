"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { useLogin } from "../hooks/use-login";
import { setCookie } from "@/utils/storage";
import { Role } from "@/constants/role";

import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Trả về đường dẫn redirect dựa trên role từ API response.
 */
function getRedirectPathByRole(role: string): string {
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

  return (
    <FormContainer onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
      <FormHeader 
        title="Đăng nhập" 
        description="Chào mừng bạn đến với PBMS. Vui lòng đăng nhập để tiếp tục."
        className="text-center"
      />
      
      <FormFields>
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input 
            id="username" 
            placeholder="Nhập tên đăng nhập" 
            {...form.register("username")} 
            disabled={isPending}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Nhập mật khẩu" 
            {...form.register("password")} 
            disabled={isPending}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
      </FormFields>

      <FormActions className="justify-center mt-8">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </FormActions>
    </FormContainer>
  );
}
