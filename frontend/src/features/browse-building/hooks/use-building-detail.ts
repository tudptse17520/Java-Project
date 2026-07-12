import { useQuery } from "@tanstack/react-query";
import { getBuildingDetail } from "@/services/browse-building.service";
import { BROWSE_BUILDING_KEYS } from "../constants/browse-building.constants";

export function useBuildingDetail(id: number | null) {
  return useQuery({
    queryKey: BROWSE_BUILDING_KEYS.detail(id as number),
    queryFn: () => getBuildingDetail(id as number),
    enabled: id !== null,
  });
}
