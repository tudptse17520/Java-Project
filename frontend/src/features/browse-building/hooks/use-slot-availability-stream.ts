import { useEffect, useRef, useState } from "react";
import { env } from "@/config/env";
import { SLOT_AVAILABILITY_EVENT_NAME } from "../constants/browse-building.constants";
import type { SlotAvailabilityEvent } from "../types/browse-building.type";

interface UseSlotAvailabilityStreamProps {
  buildingId?: number | null;
  onEvent?: (event: SlotAvailabilityEvent) => void;
}

export function useSlotAvailabilityStream({
  buildingId,
  onEvent,
}: UseSlotAvailabilityStreamProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  // We use a ref for the callback so it doesn't trigger re-renders or effect re-runs
  // if the callback changes identity.
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    // If buildingId is explicitly null, don't connect
    if (buildingId === null) return;

    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const endpoint = buildingId
        ? `/buildings/${buildingId}/availability-stream`
        : `/buildings/availability-stream`;
      
      const url = `${env.API_URL}${endpoint}`;
      
      try {
        const es = new EventSource(url, { withCredentials: true });
        eventSourceRef.current = es;

        es.onopen = () => {
          setIsConnected(true);
          setError(null);
          attemptRef.current = 0; // reset attempts on successful connection
        };

        es.addEventListener(SLOT_AVAILABILITY_EVENT_NAME, (e: MessageEvent) => {
          try {
            const data: SlotAvailabilityEvent = JSON.parse(e.data);
            if (onEventRef.current) {
              onEventRef.current(data);
            }
          } catch (err) {
            console.error("Failed to parse SSE data", err);
          }
        });

        es.onerror = (e) => {
          console.error("SSE Connection Error", e);
          setIsConnected(false);
          es.close();
          eventSourceRef.current = null;

          // Exponential backoff reconnect
          const timeout = Math.min(Math.pow(2, attemptRef.current) * 1000, 30000);
          attemptRef.current += 1;
          
          reconnectTimeoutRef.current = setTimeout(connect, timeout);
        };
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to connect SSE"));
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [buildingId]);

  return { isConnected, error };
}
