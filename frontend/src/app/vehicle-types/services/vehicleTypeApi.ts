/**
 * API Service for Vehicle Type Management.
 * Communicates with Backend REST API at /api/v1/vehicle-type.
 */

const BASE_URL = "http://localhost:8080/api/v1/vehicle-type";

// ==================== Types ====================

export type VehicleTypeStatus = "ACTIVE" | "INACTIVE";

export interface VehicleType {
  id: number;
  type_name: string;
  description: string;
  status: VehicleTypeStatus;
}

export interface VehicleTypeRequest {
  type_name: string;
  description?: string;
  status?: VehicleTypeStatus;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
}

// ==================== Helper ====================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw errorData;
  }
  return response.json();
}

// ==================== API Functions ====================

/**
 * GET /api/v1/vehicle-type
 * Lấy danh sách tất cả loại phương tiện.
 */
export async function getAllVehicleTypes(): Promise<VehicleType[]> {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<VehicleType[]>(response);
}

/**
 * POST /api/v1/vehicle-type
 * Thêm mới loại phương tiện.
 */
export async function createVehicleType(
  data: VehicleTypeRequest
): Promise<VehicleType> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<VehicleType>(response);
}

/**
 * PUT /api/v1/vehicle-type/{id}
 * Cập nhật thông tin loại phương tiện.
 */
export async function updateVehicleType(
  id: number,
  data: VehicleTypeRequest
): Promise<VehicleType> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<VehicleType>(response);
}

/**
 * PATCH /api/v1/vehicle-type/{id}/deactivate
 * Ngừng áp dụng loại phương tiện (chuyển status → INACTIVE).
 */
export async function deactivateVehicleType(
  id: number
): Promise<VehicleType> {
  const response = await fetch(`${BASE_URL}/${id}/deactivate`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<VehicleType>(response);
}
