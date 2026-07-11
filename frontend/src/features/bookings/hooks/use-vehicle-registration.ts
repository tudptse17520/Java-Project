import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerVehicle } from '@/services/vehicle.service';

export const useVehicleRegistration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};