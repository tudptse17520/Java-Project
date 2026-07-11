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
    if (d.floorName && d.occupiedSlots !== undefined) {
      occupiedMap.set(d.floorName, d.occupiedSlots);
    }
  });

  return vehicleTypes.map(vt => {
    const activeSessionsCount = floors
      .filter(f => f.vehicleTypeId === vt.id)
      .reduce((sum, f) => sum + (occupiedMap.get(f.floorName) || 0), 0);
    
    return {
      ...vt,
      activeSessionsCount
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
