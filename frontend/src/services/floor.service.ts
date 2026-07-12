/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosClient from "@/lib/axios-client";
import { Floor } from "@/features/floors/types/floor.type";

export const floorService = {
  getAll: async () => {
    const response = await axiosClient.get<Floor[]>("/api/v1/floors");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosClient.get<Floor>(`/api/v1/floors/${id}`);
    return response.data;
  },

  getByBuilding: async (buildingId: number) => {
    const response = await axiosClient.get<Floor[]>(`/api/v1/floors/building/${buildingId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axiosClient.post<Floor>("/api/v1/floors", data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await axiosClient.put<Floor>(`/api/v1/floors/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosClient.delete(`/api/v1/floors/${id}`);
    return response.data;
  },
};
