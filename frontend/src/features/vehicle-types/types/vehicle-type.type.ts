import { VehicleTypeStatus } from "@/constants/vehicle-type-status";

export interface VehicleType {
  id: number;
  typeName: string;
  description: string | null;
  status: VehicleTypeStatus;
  activeSessionsCount?: number;
}

export interface VehicleTypeRequest {
  typeName: string;
  description?: string;
  status?: VehicleTypeStatus;
}
