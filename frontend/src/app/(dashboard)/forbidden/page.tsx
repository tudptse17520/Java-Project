import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <ShieldAlert className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">403 - Truy cập bị từ chối</h1>
      <p className="text-muted-foreground">
        Bạn không có quyền truy cập trang này.
      </p>
    </div>
  );
}
