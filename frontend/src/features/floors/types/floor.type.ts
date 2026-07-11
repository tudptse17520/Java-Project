export interface Floor {
  id: number;
  floor_name: string;
  floor_level: number;
  capacity: number;
  status: string;
  available_slots: number;
  building_id: number;
  building_name: string;
  vehicle_type_id: number;
  vehicle_type_name: string;
}
