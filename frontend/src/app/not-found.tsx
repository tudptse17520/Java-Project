import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-xl text-muted-foreground">
        Trang bạn tìm kiếm không tồn tại.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
