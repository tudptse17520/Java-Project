import { BuildingStatus } from '@/constants/building-status';
import { FloorStatus } from '@/constants/floor-status';

export interface FloorResponse {
  id: number;
  floorName: string;
  floorLevel: number;
  capacity: number;
  status: FloorStatus;
  availableSlots: number;
  buildingId: number;
  buildingName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
}

export interface BuildingResponse {
  id: number;
  buildingName: string;
  address: string;
  numberOfFloors: number;
  totalAvailableSlots: number;
  status: BuildingStatus;
  floors?: FloorResponse[];
}

export interface BuildingListResponse {
  data: BuildingResponse[];
  message: string;
}

export interface BuildingActionResponse {
  id: number;
  message: string;
}
