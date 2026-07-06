// ---------------------------------------------
// Building Status Constants
// Trạng thái tòa nhà gửi xe
// ---------------------------------------------

export enum BuildingStatus {
  ACTIVE = "ACTIVE",
  MAINTENANCE = "MAINTENANCE",
  INACTIVE = "INACTIVE",
}

export const BUILDING_STATUS_LABELS: Record<BuildingStatus, string> = {
  [BuildingStatus.ACTIVE]: "Hoạt động",
  [BuildingStatus.MAINTENANCE]: "Bảo trì",
  [BuildingStatus.INACTIVE]: "Ngưng hoạt động",
};
