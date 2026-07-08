// ---------------------------------------------
// Floor Status Constants
// Trạng thái tầng đỗ xe
// ---------------------------------------------

export enum FloorStatus {
  ACTIVE = "ACTIVE",
  MAINTENANCE = "MAINTENANCE",
  LOCKED = "LOCKED",
}

export const FLOOR_STATUS_LABELS: Record<FloorStatus, string> = {
  [FloorStatus.ACTIVE]: "Hoạt động",
  [FloorStatus.MAINTENANCE]: "Bảo trì",
  [FloorStatus.LOCKED]: "Tạm khóa",
};
