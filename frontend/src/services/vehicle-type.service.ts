import axiosClient from "@/lib/axios-client";
import { VehicleType, VehicleTypeRequest } from "@/features/vehicle-types/types/vehicle-type.type";

const BASE_PATH = "/vehicle-types";

export const getVehicleTypes = async (): Promise<VehicleType[]> => {
  const [vehicleTypesRes, floorsRes, occupancyRes] = await Promise.all([
    axiosClient.get<VehicleType[]>(BASE_PATH),
    axiosClient.get<any[]>("/floors").catch(() => ({ data: [] })),
    axiosClient.get<any>("/reports/occupancy").catch(() => ({ data: { details: [] } }))
  ]);

  const vehicleTypes = vehicleTypesRes.data;
  const floors = floorsRes.data || [];
  const occupancyDetails = occupancyRes.data?.details || [];

  // Tạo map tra cứu số chỗ đang bị chiếm dụng theo tên tầng
  const occupiedMap = new Map<string, number>();
  occupancyDetails.forEach((d: any) => {
    if (d.floor_name && d.occupied_slots !== undefined) {
      occupiedMap.set(d.floor_name, d.occupied_slots);
    }
  });

  return vehicleTypes.map(vt => {
    const active_sessions_count = floors
      .filter(f => f.vehicle_type_id === vt.id)
      .reduce((sum, f) => sum + (occupiedMap.get(f.floor_name) || 0), 0);
    
    return {
      ...vt,
      active_sessions_count
    };
  });
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
