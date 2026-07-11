import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/session.service';
import type { SessionFilterParams } from '../types/session.type';

export const useSessions = (params?: SessionFilterParams) => {
  return useQuery({
    queryKey: ['sessions', params],
    queryFn: () => getSessions(params),
  });
};
