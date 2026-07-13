"use client";

import * as React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({ className, date, onDateChange }: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-[260px] justify-start text-left font-normal bg-background",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "dd LLL, yyyy", { locale: vi })} -{" "}
                {format(date.to, "dd LLL, yyyy", { locale: vi })}
              </>
            ) : (
              format(date.from, "dd LLL, yyyy", { locale: vi })
            )
          ) : (
            <span>Chọn khoảng thời gian</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange as any}
            numberOfMonths={2}
            locale={vi}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
