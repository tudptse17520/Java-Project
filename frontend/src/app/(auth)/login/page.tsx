import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Đăng nhập | PBMS",
  description: "Đăng nhập vào hệ thống PBMS",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-bg" />
      <div className="fixed inset-0 bg-background/60" />
      
      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
