// ---------------------------------------------
// Pricing Policy Hooks (Data Layer)
// React Query hooks cho CRUD bảng giá
// Tầng này CHỈ quản lý Server State (gọi API, cache, invalidate)
// ---------------------------------------------

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import {
  PricingPolicy,
  PricingPolicyRequest,
} from "@/features/pricing-policies/types/pricing-policy.type";
import {
  getPricingPolicies,
  createPricingPolicy,
  updatePricingPolicy,
  deletePricingPolicy,
} from "@/services/pricing-policy.service";
import { getVehicleTypes } from "@/services/vehicle-type.service";

// =============================================
// Query Keys
// =============================================

export const PRICING_POLICIES_QUERY_KEY = ["pricing-policies"];
export const VEHICLE_TYPES_QUERY_KEY = ["vehicle-types"];

// =============================================
// Query Hooks (GET)
// =============================================

/**
 * Lấy danh sách bảng giá (có thể lọc theo loại xe)
 */
export const usePricingPolicies = (vehicleTypeId?: number) => {
  return useQuery({
    queryKey: [...PRICING_POLICIES_QUERY_KEY, vehicleTypeId],
    queryFn: () => getPricingPolicies(vehicleTypeId),
  });
};

/**
 * Lấy danh sách loại xe cho dropdown filter
 */
export const useVehicleTypesForFilter = () => {
  return useQuery({
    queryKey: VEHICLE_TYPES_QUERY_KEY,
    queryFn: getVehicleTypes,
  });
};

// =============================================
// Mutation Hooks (POST, PUT, DELETE)
// =============================================

/**
 * Thêm mới bảng giá
 */
export const useCreatePricingPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PricingPolicy,
    AxiosError<ApiErrorResponse>,
    PricingPolicyRequest
  >({
    mutationFn: (data) => createPricingPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRICING_POLICIES_QUERY_KEY,
      });
    },
  });
};

/**
 * Cập nhật bảng giá
 */
export const useUpdatePricingPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PricingPolicy,
    AxiosError<ApiErrorResponse>,
    { id: number; data: PricingPolicyRequest }
  >({
    mutationFn: ({ id, data }) => updatePricingPolicy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRICING_POLICIES_QUERY_KEY,
      });
    },
  });
};

/**
 * Xóa bảng giá
 */
export const useDeletePricingPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiErrorResponse>, number>({
    mutationFn: (id) => deletePricingPolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRICING_POLICIES_QUERY_KEY,
      });
    },
  });
};
