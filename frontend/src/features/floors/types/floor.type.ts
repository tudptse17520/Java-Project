export interface Floor {
  id: number;
  floorName: string;
  floorLevel: number;
  capacity: number;
  status: string;
  availableSlots: number;
  buildingId: number;
  buildingName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
}
