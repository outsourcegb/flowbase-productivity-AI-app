"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: string | null;
  time?: string;
  duration?: number;
  category: "meeting" | "design" | "client" | "planning" | "marketing" | "personal";
}

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  draggedTaskId: string | null;
  activeDragTargetDate: string | null;
  categoryStyles: Record<string, { monthTask: string }>;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDragOverCell: (e: React.DragEvent, dateStr: string) => void;
  handleDragLeaveCell: () => void;
  handleDropOnCell: (e: React.DragEvent, dateStr: string) => void;
  openNewTaskDialog: (dateStr: string) => void;
  openEditTaskDialog: (task: Task) => void;
}

export function MonthView({
  currentDate,
  tasks,
  draggedTaskId,
  activeDragTargetDate,
  categoryStyles,
  handleDragStart,
  handleDragOverCell,
  handleDragLeaveCell,
  handleDropOnCell,
  openNewTaskDialog,
  openEditTaskDialog,
}: MonthViewProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);
  const totalCells = Math.ceil((daysInMonth + firstDayIndex) / 7) * 7;
  const gridCells = [];

  const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const daysInPrevMonth = getDaysInMonth(prevMonthDate);

  for (let i = 0; i < totalCells; i++) {
    let cellDate: Date;
    let isCurrentMonth = true;

    if (i < firstDayIndex) {
      const prevDay = daysInPrevMonth - firstDayIndex + i + 1;
      cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevDay);
      isCurrentMonth = false;
    } else if (i >= firstDayIndex + daysInMonth) {
      const nextDay = i - daysInMonth - firstDayIndex + 1;
      cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextDay);
      isCurrentMonth = false;
    } else {
      const currentDay = i - firstDayIndex + 1;
      cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDay);
    }

    const dateStr = cellDate.toISOString().split("T")[0];
    const cellTasks = tasks.filter((task) => task.date === dateStr);
    const isToday = new Date().toISOString().split("T")[0] === dateStr;

    gridCells.push(
      <div
        key={dateStr}
        className={cn(
          "min-h-[100px] p-2 bg-white dark:bg-zinc-950 flex flex-col transition-all duration-200 relative",
          !isCurrentMonth && "opacity-40 bg-zinc-50 dark:bg-zinc-900/40",
          activeDragTargetDate === dateStr && "bg-accent/40 scale-[0.99] z-10"
        )}
        onDragOver={(e) => handleDragOverCell(e, dateStr)}
        onDragLeave={handleDragLeaveCell}
        onDrop={(e) => handleDropOnCell(e, dateStr)}
        onDoubleClick={() => openNewTaskDialog(dateStr)}
      >
        <div className="flex justify-between items-center mb-1">
          <span
            className={cn(
              "text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-sans",
              isToday 
                ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            {cellDate.getDate()}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[120px]">
          {cellTasks.map((task) => {
            const styles = categoryStyles[task.category];
            return (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  openEditTaskDialog(task);
                }}
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold truncate cursor-grab active:cursor-grabbing hover:brightness-110 active:scale-95 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
                  styles.monthTask,
                  draggedTaskId === task.id && "opacity-40 scale-95"
                )}
              >
                {task.time && task.time !== "All Day" && (
                  <span className="opacity-75 mr-1 font-mono">{task.time.split(" ")[0]}</span>
                )}
                {task.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-900 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/45 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 p-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[1px] bg-zinc-200 dark:bg-zinc-900">
        {gridCells}
      </div>
    </div>
  );
}
