// types/floor.type.ts

export interface FloorResponseDTO {
    id: number;
    floorName: string;
    floorLevel: number;
    capacity: number;
    status: 'ACTIVE' | 'MAINTENANCE' | 'LOCKED';
    buildingId: number;
    buildingName: string;
    vehicleTypeId: number;
}

export interface FloorRequestDTO {
    floorName: string;
    floorLevel: number;
    capacity: number;
    buildingId: number;
    vehicleTypeId: number;
}