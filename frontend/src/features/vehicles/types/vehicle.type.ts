export interface VehicleRegistrationDTO {
  vehicleTypeId: number;
  plate: string;
  brand?: string;
  color?: string;
}

export interface Vehicle {
  id: number;
  userId: number;
  vehicleTypeId: number;
  vehicleTypeName?: string;
  plate: string;
  brand?: string;
  color?: string;
}
