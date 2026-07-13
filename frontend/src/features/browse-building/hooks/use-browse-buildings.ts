import { useQuery } from "@tanstack/react-query";
import { getBrowseBuildings } from "@/services/browse-building.service";
import { BROWSE_BUILDING_KEYS } from "../constants/browse-building.constants";

export function useBrowseBuildings() {
  return useQuery({
    queryKey: BROWSE_BUILDING_KEYS.lists(),
    queryFn: getBrowseBuildings,
  });
}
