import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Parking Building Management System
      </h1>
      <p className="text-lg text-muted-foreground">
        Hệ thống quản lý tòa nhà gửi xe thông minh
      </p>
      <Link
        href="/login"
        className="rounded-md bg-primary px-8 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Đăng nhập
      </Link>
    </div>
  );
}