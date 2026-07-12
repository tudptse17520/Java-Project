import { BuildingStatus } from "@/constants/building-status";
import { FloorStatus } from "@/constants/floor-status";

export interface BuildingBrowseItem {
  id: number;
  building_name: string;
  address: string;
  number_of_floors: number;
  status: BuildingStatus;
  available_slots: number;
}

export interface FloorDetail {
  id: number;
  floor_name: string;
  floor_level: number;
  capacity: number;
  status: FloorStatus;
  available_slots: number;
  building_id: number;
  building_name: string;
  vehicle_type_id: number;
  vehicle_type_name: string;
}

export interface BuildingDetail {
  id: number;
  building_name: string;
  address: string;
  number_of_floors: number;
  status: BuildingStatus;
  total_available_slots: number;
  floors: FloorDetail[];
}

export interface SlotAvailabilityEvent {
  building_id: number;
  floor_id: number;
  available_slots: number;
  building_available_slots: number;
}
