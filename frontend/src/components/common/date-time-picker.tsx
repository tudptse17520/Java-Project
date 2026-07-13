"use client";

import * as React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [time, setTime] = React.useState<string>(
    value && !isNaN(new Date(value).getTime()) ? format(new Date(value), "HH:mm") : "12:00"
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      const d = new Date(value);
      setDate(d);
      setTime(format(d, "HH:mm"));
    } else {
      setDate(undefined);
      setTime("12:00");
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && time) {
      updateValue(selectedDate, time);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date) {
      updateValue(date, newTime);
    }
  };

  const updateValue = (d: Date, t: string) => {
    const [hours, minutes] = t.split(":");
    const newDate = new Date(d);
    newDate.setHours(parseInt(hours, 10) || 0);
    newDate.setMinutes(parseInt(minutes, 10) || 0);
    
    // Convert to local ISO string (YYYY-MM-DDTHH:mm)
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const hh = String(newDate.getHours()).padStart(2, '0');
    const mm = String(newDate.getMinutes()).padStart(2, '0');
    
    onChange?.(`${year}-${month}-${day}T${hh}:${mm}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger 
        render={
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-11 px-3 border-input",
              !value && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
        {value && !isNaN(new Date(value).getTime()) ? (
          format(new Date(value), "dd/MM/yyyy HH:mm", { locale: vi })
        ) : (
          <span>Chọn ngày & giờ</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            locale={vi}
          />
          <div className="border-t p-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button 
              size="sm" 
              className="w-full mt-3" 
              onClick={() => setIsOpen(false)}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
