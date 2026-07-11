"use client";

import { useState } from "react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookingTable } from "@/features/bookings/components/booking-table";
import { BookingModal } from "@/features/bookings/components/booking-modal";
import { useUserBookings, useCreateBooking } from "@/features/bookings/hooks/use-bookings";
import { useAuthStore } from "@/stores/auth.store";
import type { BookingFormValues } from "@/features/bookings/schemas/booking-form.schema";
import toast from "react-hot-toast";

export default function DriverReservationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  const { data: bookings = [], isLoading, error } = useUserBookings(user?.id);
  const createBookingMutation = useCreateBooking();

  const handleSubmit = (data: BookingFormValues) => {
    if (!user?.id) {
      toast.error("Bạn cần đăng nhập để đặt chỗ.");
      return;
    }

    createBookingMutation.mutate(
      {
        userId: user.id,
        vehicleId: data.vehicleId,
        parkingSlotId: data.parkingSlotId,
        expectedTimeIn: data.expectedTimeIn,
        expectedTimeOut: data.expectedTimeOut,
      },
      {
        onSuccess: () => {
          toast.success("Đã tạo đơn đặt chỗ thành công.");
          setIsModalOpen(false);
        },
        onError: () => {
          toast.error("Đã xảy ra lỗi khi tạo đặt chỗ.");
        },
      }
    );
  };

  if (error) {
    return (
      <PageContainer>
        <div className="flex h-full items-center justify-center text-destructive">
          Đã xảy ra lỗi khi tải danh sách đặt chỗ của bạn.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Đặt chỗ trước"
        description="Quản lý và theo dõi các đơn đặt chỗ của bạn."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Đặt chỗ mới
          </Button>
        }
      />
      
      <div className="mt-6">
        <BookingTable data={bookings} isLoading={isLoading} />
      </div>

      <BookingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createBookingMutation.isPending}
      />
    </PageContainer>
  );
}
