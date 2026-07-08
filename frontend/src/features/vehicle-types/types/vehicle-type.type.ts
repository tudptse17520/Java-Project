import { VehicleTypeStatus } from "@/constants/vehicle-type-status";

export interface VehicleType {
  id: number;
  type_name: string;
  description: string | null;
  status: VehicleTypeStatus;
}

export interface VehicleTypeRequest {
  type_name: string;
  description?: string;
  status?: VehicleTypeStatus;
}
