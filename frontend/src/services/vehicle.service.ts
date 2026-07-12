import axiosClient from '@/lib/axios-client';
import { VehicleRegistrationDTO } from '@/features/vehicles/types/vehicle.type';

export const registerVehicle = async (data: VehicleRegistrationDTO) => {
  return axiosClient.post('/vehicles', data);
};