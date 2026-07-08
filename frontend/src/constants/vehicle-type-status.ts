// ---------------------------------------------
// Vehicle Type Status Constants
// Trạng thái loại phương tiện
// ---------------------------------------------

export enum VehicleTypeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const VEHICLE_TYPE_STATUS_LABELS: Record<VehicleTypeStatus, string> = {
  [VehicleTypeStatus.ACTIVE]: "Đang phục vụ",
  [VehicleTypeStatus.INACTIVE]: "Ngưng phục vụ",
};
