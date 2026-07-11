export interface FloorResponse {
  id: number;
  floorName: string;
  floorLevel: number;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
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
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
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
