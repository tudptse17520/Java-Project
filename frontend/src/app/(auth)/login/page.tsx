import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Đăng nhập | PBMS",
  description: "Đăng nhập vào hệ thống PBMS",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <LoginForm />
    </div>
  );
}
