// ---------------------------------------------
// Slot Status Constants
// Trạng thái vị trí đỗ xe (Parking Slot)
// ---------------------------------------------

export enum SlotStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  MAINTENANCE = "MAINTENANCE",
  LOCKED = "LOCKED",
}

export const SLOT_STATUS_LABELS: Record<SlotStatus, string> = {
  [SlotStatus.AVAILABLE]: "Còn trống",
  [SlotStatus.OCCUPIED]: "Đang sử dụng",
  [SlotStatus.RESERVED]: "Đã đặt trước",
  [SlotStatus.MAINTENANCE]: "Bảo trì",
  [SlotStatus.LOCKED]: "Tạm khóa",
};
