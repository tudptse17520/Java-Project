import { useQuery } from "@tanstack/react-query";
import { getVehicleTypes } from "@/services/vehicle-type.service";

export const useVehicleTypes = () => {
  return useQuery({
    queryKey: ["vehicle-types"],
    queryFn: getVehicleTypes,
  });
};
