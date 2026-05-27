"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: "month" | "week";
  setViewMode: (mode: "month" | "week") => void;
  navigateMonth: (direction: "prev" | "next") => void;
  jumpToToday: () => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  setViewMode,
  navigateMonth,
  jumpToToday,
}: CalendarHeaderProps) {
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <header className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-zinc-950/20 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("prev")}
            className="h-8 w-8 bg-white dark:bg-zinc-900"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("next")}
            className="h-8 w-8 bg-white dark:bg-zinc-900"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={jumpToToday}
          className="bg-white dark:bg-zinc-900 text-xs font-semibold"
        >
          Today
        </Button>

        <h2 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 ml-2">
          {viewMode === "month" 
            ? formatMonthYear(currentDate) 
            : `Week View — ${currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
        </h2>
      </div>

      <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800">
        <button
          onClick={() => setViewMode("month")}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
            viewMode === "month" 
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm" 
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          )}
        >
          Month
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
            viewMode === "week" 
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm" 
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          )}
        >
          Week
        </button>
      </div>
    </header>
  );
}
