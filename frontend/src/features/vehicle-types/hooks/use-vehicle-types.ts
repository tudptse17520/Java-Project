import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import {
  getVehicleTypes,
  createVehicleType,
  updateVehicleType,
  deactivateVehicleType,
} from "@/services/vehicle-type.service";
import {
  VehicleType,
  VehicleTypeRequest,
} from "@/features/vehicle-types/types/vehicle-type.type";

export const VEHICLE_TYPES_QUERY_KEY = ["vehicle-types"];

export const useVehicleTypes = () => {
  return useQuery({
    queryKey: VEHICLE_TYPES_QUERY_KEY,
    queryFn: getVehicleTypes,
  });
};

export const useCreateVehicleType = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleType,
    AxiosError<ApiErrorResponse>,
    VehicleTypeRequest
  >({
    mutationFn: (data) => createVehicleType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_TYPES_QUERY_KEY });
    },
  });
};

export const useUpdateVehicleType = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleType,
    AxiosError<ApiErrorResponse>,
    { id: number; data: VehicleTypeRequest }
  >({
    mutationFn: ({ id, data }) => updateVehicleType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_TYPES_QUERY_KEY });
    },
  });
};

export const useDeactivateVehicleType = () => {
  const queryClient = useQueryClient();

  return useMutation<VehicleType, AxiosError<ApiErrorResponse>, number>({
    mutationFn: (id) => deactivateVehicleType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_TYPES_QUERY_KEY });
    },
  });
};
