// ---------------------------------------------
// Pricing Policy Actions Hook (UI Layer)
// Quản lý trạng thái UI: form, dialog, filter
// Tầng này CHỈ quản lý Client State và gọi lệnh mutate
// ---------------------------------------------

import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import { PricingPolicy } from "@/features/pricing-policies/types/pricing-policy.type";
import { PricingPolicyFormValues } from "@/features/pricing-policies/schemas/pricing-policy.schema";
import {
  useCreatePricingPolicy,
  useUpdatePricingPolicy,
  useDeletePricingPolicy,
} from "@/features/pricing-policies/hooks/use-pricing-policies";

export function usePricingPolicyActions() {
  const createMutation = useCreatePricingPolicy();
  const updateMutation = useUpdatePricingPolicy();
  const deleteMutation = useDeletePricingPolicy();

  // =============================================
  // State for Form Dialog (Thêm / Sửa)
  // =============================================
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PricingPolicy | null>(
    null
  );

  // =============================================
  // State for Confirm Dialog (Xóa)
  // =============================================
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<PricingPolicy | null>(
    null
  );

  // =============================================
  // State for Filter (Lọc theo loại xe)
  // =============================================
  const [filterVehicleTypeId, setFilterVehicleTypeId] = useState<
    number | undefined
  >(undefined);

  // =============================================
  // Form Handlers
  // =============================================

  const handleOpenCreate = () => {
    setSelectedPolicy(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (policy: PricingPolicy) => {
    setSelectedPolicy(policy);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPolicy(null);
  };

  const handleFormSubmit = (values: PricingPolicyFormValues) => {
    if (selectedPolicy) {
      // Cập nhật
      updateMutation.mutate(
        { id: selectedPolicy.id, data: values },
        {
          onSuccess: () => {
            toast.success("Cập nhật bảng giá thành công");
            handleCloseForm();
          },
          onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(
              error.response?.data?.message || "Lỗi khi cập nhật bảng giá"
            );
          },
        }
      );
    } else {
      // Thêm mới
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Thêm mới bảng giá thành công");
          handleCloseForm();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          toast.error(
            error.response?.data?.message || "Lỗi khi thêm mới bảng giá"
          );
        },
      });
    }
  };

  // =============================================
  // Delete Handlers
  // =============================================

  const handleOpenDelete = (policy: PricingPolicy) => {
    setPolicyToDelete(policy);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setPolicyToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!policyToDelete) return;

    deleteMutation.mutate(policyToDelete.id, {
      onSuccess: () => {
        toast.success("Xóa bảng giá thành công");
        handleCloseConfirm();
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        toast.error(
          error.response?.data?.message || "Lỗi khi xóa bảng giá"
        );
      },
    });
  };

  // =============================================
  // Filter Handlers
  // =============================================

  const handleFilterChange = (vehicleTypeId: number | undefined) => {
    setFilterVehicleTypeId(vehicleTypeId);
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return {
    // Form
    isFormOpen,
    selectedPolicy,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormSubmit,

    // Delete
    isConfirmOpen,
    policyToDelete,
    isDeleting: deleteMutation.isPending,
    handleOpenDelete,
    handleCloseConfirm,
    handleConfirmDelete,

    // Filter
    filterVehicleTypeId,
    handleFilterChange,
  };
}
