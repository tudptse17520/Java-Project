import { BuildingStatus } from "@/constants/building-status";
import { FloorStatus } from "@/constants/floor-status";

export interface BuildingBrowseItem {
  id: number;
  buildingName: string;
  address: string;
  numberOfFloors: number;
  status: BuildingStatus;
  availableSlots: number;
}

export interface FloorDetail {
  id: number;
  floorName: string;
  floorLevel: number;
  capacity: number;
  status: FloorStatus;
  availableSlots: number;
  buildingId: number | null;
  buildingName: string | null;
  vehicleTypeId: number | null;
  vehicleTypeName: string;
}

export interface BuildingDetail {
  id: number;
  buildingName: string;
  address: string;
  numberOfFloors: number;
  status: BuildingStatus;
  totalAvailableSlots: number;
  floors: FloorDetail[];
}

export interface SlotAvailabilityEvent {
  building_id: number;
  floor_id: number;
  available_slots: number;
  building_available_slots: number;
}
