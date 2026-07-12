"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { BookingTable } from "@/features/bookings/components/booking-table";
import { useAllBookings } from "@/features/bookings/hooks/use-bookings";

export default function ManagerBookingsPage() {
  const { data: bookings = [], isLoading, error } = useAllBookings();

  if (error) {
    return (
      <PageContainer>
        <div className="flex h-full items-center justify-center text-destructive">
          Đã xảy ra lỗi khi tải danh sách đặt chỗ.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý Đặt chỗ"
        description="Xem toàn bộ danh sách khách hàng đặt trước vị trí đỗ xe."
      />
      <div className="mt-6">
        <BookingTable data={bookings} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
