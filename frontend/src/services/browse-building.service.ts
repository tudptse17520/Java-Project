import axiosClient from "@/lib/axios-client";
import type { BuildingBrowseItem, BuildingDetail } from "@/features/browse-building/types/browse-building.type";

const BASE_PATH = "/buildings";

/**
 * Fetch all buildings with aggregated available-slot counts
 */
export const getBrowseBuildings = async (): Promise<BuildingBrowseItem[]> => {
  const response = await axiosClient.get<BuildingBrowseItem[]>(`${BASE_PATH}/browse`);
  return response.data;
};

/**
 * Fetch a single building's floor-level detail
 */
export const getBuildingDetail = async (id: number): Promise<BuildingDetail> => {
  const response = await axiosClient.get<BuildingDetail>(`${BASE_PATH}/detail/${id}`);
  return response.data;
};
