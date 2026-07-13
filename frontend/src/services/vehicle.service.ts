import axiosClient from '@/lib/axios-client';
import { VehicleRegistrationDTO, Vehicle } from '@/features/vehicles/types/vehicle.type';

export const registerVehicle = async (data: VehicleRegistrationDTO) => {
  return axiosClient.post('/vehicles', data);
};

export const getVehiclesByUser = async (userId: number): Promise<Vehicle[]> => {
  const { data } = await axiosClient.get<Vehicle[]>(`/vehicles/user/${userId}`);
  return data;
};