"use client";

import { useState } from "react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookingTable } from "@/features/bookings/components/booking-table";
import { BookingModal } from "@/features/bookings/components/booking-modal";
import {
  useUserBookings,
  useCreateBooking,
} from "@/features/bookings/hooks/use-bookings";
import { useAuthStore } from "@/stores/auth.store";
import { type BookingFormValues } from "@/features/bookings/schemas/booking-form.schema";

export default function UserBookingsPage() {
  const { user } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fallback if somehow user is not available
  const userId = user?.id || 0;

  const { data: bookings = [], isLoading, error } = useUserBookings(userId);
  const createBookingMutation = useCreateBooking();

  const handleCreateBooking = (data: BookingFormValues) => {
    createBookingMutation.mutate(
      {
        vehicleId: Number(data.vehicleId),
        parkingSlotId: Number(data.parkingSlotId),
        expectedTimeIn: data.expectedTimeIn,
        expectedTimeOut: data.expectedTimeOut,
      },
      {
        onSuccess: () => {
          alert("Đã tạo yêu cầu đặt chỗ thành công.");
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Không thể tạo đặt chỗ.");
        },
      }
    );
  };

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
        title="Lịch sử Đặt chỗ"
        description="Quản lý và xem lại các vị trí đỗ xe bạn đã đặt trước."
      />
      
      <Toolbar className="justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Đặt chỗ mới
        </Button>
      </Toolbar>

      <div className="mt-6">
        <BookingTable data={bookings} isLoading={isLoading} />
      </div>

      <BookingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBooking}
        isLoading={createBookingMutation.isPending}
      />
    </PageContainer>
  );
}
