import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerVehicle } from "@/services/vehicle.service";
import { VehicleRegistrationDTO } from "../types/vehicle.type";

export const useRegisterVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleRegistrationDTO) => registerVehicle(data),
    onSuccess: () => {
      // Invalidate queries if there is a list of vehicles to refresh
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
