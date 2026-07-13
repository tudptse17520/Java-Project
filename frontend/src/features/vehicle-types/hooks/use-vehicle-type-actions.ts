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
            handleCloseForm();
          }
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          handleCloseForm();
        }
      });
    }
  };

  // --- Deactivate Handlers ---

  const handleOpenDeactivate = (vehicleType: VehicleType) => {
    if ((vehicleType.activeSessionsCount || 0) > 0) {
      toast.error("Không thể ngừng áp dụng loại xe này vì đang có xe gửi trong bãi!");
      return;
    }
    setVehicleTypeToDeactivate(vehicleType);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setVehicleTypeToDeactivate(null);
  };

  const handleConfirmDeactivate = () => {
    if (!vehicleTypeToDeactivate) return;

    deactivateMutation.mutate({ id: vehicleTypeToDeactivate.id, typeName: vehicleTypeToDeactivate.typeName }, {
      onSuccess: () => {
        handleCloseConfirm();
      }
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
