import { useQuery } from "@tanstack/react-query";
import { sessionService } from "@/services/session.service";
import { SESSION_QUERY_KEYS } from "../constants/session.constants";
import { SessionStatus } from "@/constants/session-status";

interface UseSessionsParams {
  plate?: string;
  status?: SessionStatus;
  from_date?: string;
  enabled?: boolean;
}

export const useSessions = ({ plate, status, from_date, enabled = true }: UseSessionsParams = {}) => {
  return useQuery({
    queryKey: SESSION_QUERY_KEYS.list({ plate, status, from_date }),
    queryFn: () => sessionService.getParkingSessions({ plate, status, from_date }),
    enabled: enabled && (!!plate || !!status || !!from_date),
  });
};
