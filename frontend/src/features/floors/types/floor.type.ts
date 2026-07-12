import { FloorStatus } from '@/constants/floor-status';

export interface Floor {
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
