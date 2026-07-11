export interface BuildingResponse {
  id: number;
  buildingName: string;
  address: string;
  totalSlots: number;
  availableSlots: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export interface BuildingListResponse {
  total_items: number;
  data: BuildingResponse[];
  message: string;
}
