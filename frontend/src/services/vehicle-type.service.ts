import axiosClient from "@/lib/axios-client";
import { VehicleType, VehicleTypeRequest } from "@/features/vehicle-types/types/vehicle-type.type";

const BASE_PATH = "/vehicle-types";

export const getVehicleTypes = async (): Promise<VehicleType[]> => {
  const response = await axiosClient.get<VehicleType[]>(BASE_PATH);
  return response.data;
};

export const createVehicleType = async (data: VehicleTypeRequest): Promise<VehicleType> => {
  const response = await axiosClient.post<VehicleType>(BASE_PATH, data);
  return response.data;
};

export const updateVehicleType = async (
  id: number,
  data: VehicleTypeRequest
): Promise<VehicleType> => {
  const response = await axiosClient.put<VehicleType>(`${BASE_PATH}/${id}`, data);
  return response.data;
};

export const deactivateVehicleType = async (id: number): Promise<VehicleType> => {
  const response = await axiosClient.patch<VehicleType>(`${BASE_PATH}/${id}/deactivate`);
  return response.data;
};
