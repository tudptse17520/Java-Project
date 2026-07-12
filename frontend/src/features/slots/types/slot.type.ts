import { SlotStatus } from '@/constants/slot-status';

export interface ParkingSlot {
  id: number;
  slotName: string;
  floorId: number;
  status: SlotStatus;
}

export interface CreateSlotDto {
  floorId: number;
  slotName: string;
  status: SlotStatus;
}