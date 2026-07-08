import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import { VehicleType } from "@/features/vehicle-types/types/vehicle-type.type";
import { VehicleTypeFormValues } from "@/features/vehicle-types/schemas/vehicle-type.schema";
import {
  useCreateVehicleType,
  useUpdateVehicleType,
  useDeactivateVehicleType,
} from "@/features/vehicle-types/hooks/use-vehicle-types";

export function useVehicleTypeActions() {
  const createMutation = useCreateVehicleType();
  const updateMutation = useUpdateVehicleType();
  const deactivateMutation = useDeactivateVehicleType();

  // State for Form Dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType | null>(null);

  // State for Confirm Dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vehicleTypeToDeactivate, setVehicleTypeToDeactivate] =
    useState<VehicleType | null>(null);

  // --- Form Handlers ---

  const handleOpenCreate = () => {
    setSelectedVehicleType(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedVehicleType(null);
  };

  const handleFormSubmit = (values: VehicleTypeFormValues) => {
    if (selectedVehicleType) {
      updateMutation.mutate(
        { id: selectedVehicleType.id, data: values },
        {
          onSuccess: () => {
            toast.success("Cập nhật loại phương tiện thành công");
            handleCloseForm();
          },
          onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(
              error.response?.data?.message ||
                "Lỗi khi cập nhật loại phương tiện"
            );
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Thêm mới loại phương tiện thành công");
          handleCloseForm();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          toast.error(
            error.response?.data?.message ||
              "Lỗi khi thêm mới loại phương tiện"
          );
        },
      });
    }
  };

  // --- Deactivate Handlers ---

  const handleOpenDeactivate = (vehicleType: VehicleType) => {
    setVehicleTypeToDeactivate(vehicleType);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setVehicleTypeToDeactivate(null);
  };

  const handleConfirmDeactivate = () => {
    if (!vehicleTypeToDeactivate) return;

    deactivateMutation.mutate(vehicleTypeToDeactivate.id, {
      onSuccess: () => {
        toast.success("Đã ngừng áp dụng loại phương tiện");
        handleCloseConfirm();
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        toast.error(
          error.response?.data?.message ||
            "Lỗi khi vô hiệu hóa loại phương tiện"
        );
      },
    });
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return {
    // Form
    isFormOpen,
    selectedVehicleType,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormSubmit,

    // Deactivate
    isConfirmOpen,
    vehicleTypeToDeactivate,
    isDeactivating: deactivateMutation.isPending,
    handleOpenDeactivate,
    handleCloseConfirm,
    handleConfirmDeactivate,
  };
}
