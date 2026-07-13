import { useQuery } from "@tanstack/react-query";
import { sessionService } from "@/services/session.service";
import { useAuthStore } from "@/stores/auth.store";
import { SessionStatus } from "@/constants/session-status";

export const USER_SESSION_KEYS = {
  all: ["user-sessions"] as const,
  active: (userId: number) => [...USER_SESSION_KEYS.all, userId, "active"] as const,
};

export function useUserActiveSession() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: USER_SESSION_KEYS.active(user?.id || 0),
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await sessionService.getUserSessions(user.id);
      if (!response.data || response.data.length === 0) return null;

      // Find the first IN_PROGRESS session
      return response.data.find((s) => s.status === SessionStatus.IN_PROGRESS) || null;
    },
    enabled: !!user?.id,
  });
}
