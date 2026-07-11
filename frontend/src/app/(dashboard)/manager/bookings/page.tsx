"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { DataTable } from "@/components/common/data-table";
import { useBookings } from "@/features/bookings/hooks/use-bookings";
import { columns } from "@/features/bookings/components/booking-columns";

export default function ManageBookingsPage() {
  const { data, isLoading, isError } = useBookings();

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý đặt chỗ"
        description="Danh sách các đơn đặt chỗ của khách hàng"
      />
      <Toolbar>
        <div>
          {/* ReservationFilter hoặc các nút chức năng sẽ thêm vào đây */}
        </div>
      </Toolbar>
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
