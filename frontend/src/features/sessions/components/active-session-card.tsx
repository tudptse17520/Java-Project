import React from "react";
import { Clock, MapPin, Ticket } from "lucide-react";
import { useUserActiveSession } from "../hooks/use-user-active-session";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/format-date";

export function ActiveSessionCard() {
  const { data: activeSession, isLoading, isError } = useUserActiveSession();

  if (isLoading) {
    return <Skeleton className="h-28 w-full rounded-xl mb-6" />;
  }

  if (isError || !activeSession) {
    return null;
  }

  // The backend DTO uses camelCase (ticketCode, timeIn) via ModelMapper
  const ticketCode = (activeSession as any).ticketCode || (activeSession as any).ticket_code || "—";
  const timeIn = (activeSession as any).timeIn || (activeSession as any).time_in;
  const plate = activeSession.plate;

  return (
    <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-primary flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Lượt gửi xe đang diễn ra
        </h3>
        <span className="text-xs font-medium bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full">
          {plate}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Ticket className="h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs">Mã vé</p>
            <p className="font-medium text-foreground">{ticketCode}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs">Giờ vào</p>
            <p className="font-medium text-foreground">
              {timeIn ? formatDateTime(timeIn) : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
