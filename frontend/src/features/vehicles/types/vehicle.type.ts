export interface VehicleRegistrationDTO {
  userId: number;
  vehicleTypeId: number;
  plate: string;
  brand?: string;
  color?: string;
}

export interface Vehicle {
  id: number;
  userId: number;
  vehicleTypeId: number;
  plate: string;
  brand?: string;
  color?: string;
}
