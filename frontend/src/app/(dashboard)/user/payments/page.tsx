import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán | PBMS User",
  description: "Lịch sử và giao dịch thanh toán",
};

export default function UserPaymentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Thanh toán</h2>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Đang phát triển</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Tính năng thanh toán trực tuyến và xem lịch sử giao dịch đang được xây dựng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
