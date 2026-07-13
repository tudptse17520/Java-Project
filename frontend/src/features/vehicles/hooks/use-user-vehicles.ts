import { useQuery } from "@tanstack/react-query";
import { getVehiclesByUser } from "@/services/vehicle.service";

export const VEHICLE_KEYS = {
  all: ["vehicles"] as const,
  lists: () => [...VEHICLE_KEYS.all, "list"] as const,
  userVehicles: (userId?: number) => [...VEHICLE_KEYS.lists(), userId] as const,
};

export function useUserVehicles(userId?: number) {
  return useQuery({
    queryKey: VEHICLE_KEYS.userVehicles(userId),
    queryFn: async () => {
      if (!userId) return [];
      return await getVehiclesByUser(userId);
    },
    enabled: !!userId,
  });
}
