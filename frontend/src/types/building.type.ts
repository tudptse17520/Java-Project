export interface FloorResponse {
  id: number;
  floor_name: string;
  floor_level: number;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  available_slots: number;
  building_id: number;
  building_name: string;
  vehicle_type_id: number;
  vehicle_type_name: string;
}

export interface BuildingResponse {
  id: number;
  building_name: string;
  address: string;
  number_of_floors: number;
  total_available_slots: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  floors?: FloorResponse[];
}

export interface BuildingListResponse {
  total_items: number;
  data: BuildingResponse[];
  message: string;
}
