import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lượt gửi xe | PBMS User",
  description: "Lịch sử lượt gửi xe của bạn",
};

export default function UserSessionsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Lịch sử lượt gửi xe</h2>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Đang phát triển</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Tính năng xem lịch sử gửi xe cá nhân đang được xây dựng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
