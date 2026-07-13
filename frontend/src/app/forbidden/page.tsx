import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10">
        <ShieldAlert className="h-10 w-10 text-rose-600 dark:text-rose-400" />
      </div>
      <div className="text-center max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight">403</h1>
        <p className="mt-1 text-lg text-muted-foreground">Truy cập bị từ chối</p>
        <p className="mt-2 text-sm text-muted-foreground/70 leading-relaxed">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/85"
      >
        <ArrowLeft className="h-4 w-4" />
        Về trang chủ
      </Link>
    </div>
  );
}
