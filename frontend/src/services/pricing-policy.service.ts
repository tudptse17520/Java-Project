// ---------------------------------------------
// Pricing Policy Service
// Gọi API quản lý bảng giá qua axiosClient
// ---------------------------------------------

import axiosClient from "@/lib/axios-client";
import {
  PricingPolicy,
  PricingPolicyRequest,
} from "@/features/pricing-policies/types/pricing-policy.type";

const BASE_PATH = "/pricing-policies";

/**
 * Lấy danh sách bảng giá (có thể lọc theo loại xe)
 */
export const getPricingPolicies = async (
  vehicleTypeId?: number
): Promise<PricingPolicy[]> => {
  const params = vehicleTypeId ? { vehicleTypeId: vehicleTypeId } : {};
  const response = await axiosClient.get<{ message: string; data: PricingPolicy[] }>(BASE_PATH, {
    params,
  });
  return response.data.data;
};

/**
 * Thêm mới bảng giá
 */
export const createPricingPolicy = async (
  data: PricingPolicyRequest
): Promise<PricingPolicy> => {
  const response = await axiosClient.post<PricingPolicy>(BASE_PATH, data);
  return response.data;
};

/**
 * Cập nhật bảng giá
 */
export const updatePricingPolicy = async (
  id: number,
  data: PricingPolicyRequest
): Promise<PricingPolicy> => {
  const response = await axiosClient.put<PricingPolicy>(
    `${BASE_PATH}/${id}`,
    data
  );
  return response.data;
};

/**
 * Xóa bảng giá
 */
export const deletePricingPolicy = async (id: number): Promise<void> => {
  await axiosClient.delete(`${BASE_PATH}/${id}`);
};
