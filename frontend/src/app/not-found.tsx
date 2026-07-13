import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <div className="text-center max-w-sm">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Không tìm thấy trang</p>
        <p className="mt-2 text-sm text-muted-foreground/70 leading-relaxed">
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
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
