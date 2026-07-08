import { VehicleType } from "@/features/vehicle-types/types/vehicle-type.type";
import { VehicleTypeStatus } from "@/constants/vehicle-type-status";

export const mockVehicleTypes: VehicleType[] = [
  {
    id: 1,
    type_name: "Xe đạp",
    description: "Xe 2 bánh không động cơ",
    status: VehicleTypeStatus.ACTIVE,
  },
  {
    id: 2,
    type_name: "Xe máy",
    description: "Xe 2 bánh có động cơ",
    status: VehicleTypeStatus.ACTIVE,
  },
  {
    id: 3,
    type_name: "Ô tô 4 chỗ",
    description: "Xe hơi 4-5 chỗ ngồi",
    status: VehicleTypeStatus.INACTIVE,
  },
  {
    id: 4,
    type_name: "Ô tô 7 chỗ",
    description: "Xe hơi gia đình",
    status: VehicleTypeStatus.ACTIVE,
  },
];
