export interface ParkingSlot {
  id: number;
  slotName: string;
  floorId: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'LOCKED';
}

export interface CreateSlotDto {
  floorId: number;
  slotName: string;
  status: string;
}