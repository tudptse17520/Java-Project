import axiosClient from '@/lib/axios-client';
import { VehicleRegistrationDTO } from '@/features/bookings/types/vehicle.type';

export const registerVehicle = async (data: VehicleRegistrationDTO) => {
  return axiosClient.post('/vehicles', data);
};