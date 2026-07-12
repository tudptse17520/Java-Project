"use client";

import { useState, useMemo } from "react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { BookingTable, type BookingContextData } from "@/features/bookings/components/booking-table";
import { BookingFilter } from "@/features/bookings/components/booking-filter";
import { useAllBookings } from "@/features/bookings/hooks/use-bookings";

// Mock data bổ sung ngữ cảnh cho các booking (vì Backend chưa trả về đủ các trường)
const MOCK_CONTEXT: Record<number, Partial<BookingContextData>> = {
  1: { customerName: "Nguyễn Văn A", customerPhone: "0901 234 567", licensePlate: "51F-123.45", vehicleTypeName: "Ô tô", expectedTimeOut: "2026-07-13T06:30:00" },
  2: { customerName: "Trần Thị B", customerPhone: "0912 345 678", licensePlate: "59C1-456.78", vehicleTypeName: "Xe máy", expectedTimeOut: "2026-07-13T10:00:00" },
  3: { customerName: "Lê Hoàng C", customerPhone: "0923 456 789", licensePlate: "51G-789.12", vehicleTypeName: "Ô tô", expectedTimeOut: "2026-07-14T08:00:00" },
  4: { customerName: "Phạm Minh D", customerPhone: "0934 567 890", licensePlate: "60A1-012.34", vehicleTypeName: "Xe máy", expectedTimeOut: "2026-07-13T18:00:00" },
  5: { customerName: "Hoàng Thị E", customerPhone: "0945 678 901", licensePlate: "51H-345.67", vehicleTypeName: "Ô tô", expectedTimeOut: "2026-07-13T22:00:00" },
};

export default function ManagerBookingsPage() {
  const { data: rawBookings = [], isLoading, error } = useAllBookings();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Enrich raw data with mock context & apply filters
  const bookings = useMemo<BookingContextData[]>(() => {
    let enriched = rawBookings.map((b: any) => ({
      ...b,
      ...(MOCK_CONTEXT[b.bookingId] || {
        customerName: "Khách vãng lai",
        customerPhone: "N/A",
        licensePlate: "Chưa cập nhật",
        vehicleTypeName: "N/A",
        expectedTimeOut: undefined,
      }),
    }));

    // Filter by status
    if (statusFilter) {
      enriched = enriched.filter((b: BookingContextData) => b.status === statusFilter);
    }

    // Filter by keyword
    if (keyword) {
      const lowerKw = keyword.toLowerCase();
      enriched = enriched.filter((b: BookingContextData) =>
        b.bookingId.toString().includes(lowerKw) ||
        b.customerName?.toLowerCase().includes(lowerKw) ||
        b.licensePlate?.toLowerCase().includes(lowerKw) ||
        b.customerPhone?.includes(lowerKw)
      );
    }

    return enriched;
  }, [rawBookings, keyword, statusFilter]);

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

      <Toolbar>
        <BookingFilter
          keyword={keyword}
          onKeywordChange={setKeyword}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </Toolbar>

      <div className="mt-4">
        <BookingTable data={bookings} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
