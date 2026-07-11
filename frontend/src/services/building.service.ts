import axiosClient from '@/lib/axios-client';
import { env } from '@/config/env';
import type { BuildingResponse, BuildingListResponse, BuildingActionResponse } from '@/types/building.type';
import type { BuildingCreateForm, BuildingUpdateForm } from '@/features/buildings/schemas/building-form.schema';

const BUILDING_API_URL = `${env.API_URL}/v1/buildings`;

export const getBuildings = async (keyword?: string, status?: string): Promise<BuildingListResponse> => {
  const params: Record<string, string> = {};
  if (keyword) params.keyword = keyword;
  if (status && status !== 'ALL') params.status = status;

  const response = await axiosClient.get<BuildingListResponse>(BUILDING_API_URL, { params });
  return response.data;
};

export const getBuildingDetail = async (id: number): Promise<BuildingResponse> => {
  const response = await axiosClient.get<BuildingResponse>(`${BUILDING_API_URL}/${id}`);
  return response.data;
};

export const createBuilding = async (data: BuildingCreateForm): Promise<BuildingActionResponse> => {
  const response = await axiosClient.post<BuildingActionResponse>(BUILDING_API_URL, data);
  return response.data;
};

export const updateBuilding = async (id: number, data: BuildingUpdateForm): Promise<BuildingActionResponse> => {
  const response = await axiosClient.put<BuildingActionResponse>(`${BUILDING_API_URL}/${id}`, data);
  return response.data;
};

export const updateBuildingStatus = async (id: number, status: string): Promise<BuildingActionResponse> => {
  const response = await axiosClient.patch<BuildingActionResponse>(`${BUILDING_API_URL}/${id}/status`, { status });
  return response.data;
};
