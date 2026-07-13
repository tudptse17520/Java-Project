import { ParkingSquare } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground animate-pulse">
        <ParkingSquare className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
