"use client";

import React from "react";
import { Clock } from "lucide-react";
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

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  draggedTaskId: string | null;
  activeDragTargetDate: string | null;
  categoryStyles: Record<string, { weekTask: string; text: string }>;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDragOverCell: (e: React.DragEvent, dateStr: string) => void;
  handleDragLeaveCell: () => void;
  handleDropOnCell: (e: React.DragEvent, dateStr: string) => void;
  openEditTaskDialog: (task: Task) => void;
}

export function WeekView({
  currentDate,
  tasks,
  draggedTaskId,
  activeDragTargetDate,
  categoryStyles,
  handleDragStart,
  handleDragOverCell,
  handleDragLeaveCell,
  handleDropOnCell,
  openEditTaskDialog,
}: WeekViewProps) {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  const columns = [];
  for (let d = 0; d < 7; d++) {
    const colDate = new Date(startOfWeek);
    colDate.setDate(startOfWeek.getDate() + d);
    const dateStr = colDate.toISOString().split("T")[0];
    const isToday = new Date().toISOString().split("T")[0] === dateStr;
    
    const dayName = colDate.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = colDate.getDate();
    const dayTasks = tasks.filter((task) => task.date === dateStr);

    columns.push(
      <div 
        key={dateStr}
        className={cn(
          "flex-1 flex flex-col min-w-[120px] relative",
          activeDragTargetDate === dateStr && "bg-accent/20 z-10"
        )}
        onDragOver={(e) => handleDragOverCell(e, dateStr)}
        onDragLeave={handleDragLeaveCell}
        onDrop={(e) => handleDropOnCell(e, dateStr)}
      >
        <div className={cn(
          "p-3 border-b border-zinc-200 dark:border-zinc-900 flex flex-col items-center justify-center sticky top-0 bg-white dark:bg-zinc-950 z-20",
          isToday && "bg-purple-500/5"
        )}>
          <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">{dayName}</span>
          <span className={cn(
            "text-lg font-extrabold w-7 h-7 rounded-full flex items-center justify-center mt-1 font-sans",
            isToday 
              ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]" 
              : "text-zinc-800 dark:text-zinc-200"
          )}>
            {dayNum}
          </span>
        </div>

        <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-y-auto min-h-[450px]">
          {dayTasks.map((task) => {
            const styles = categoryStyles[task.category];
            return (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => openEditTaskDialog(task)}
                className={cn(
                  "p-2 rounded-lg text-xs font-semibold cursor-grab active:cursor-grabbing hover:brightness-115 active:scale-[0.98] transition-all border shadow-sm flex flex-col gap-1",
                  styles.weekTask,
                  draggedTaskId === task.id && "opacity-40 scale-95"
                )}
              >
                <div className={cn("font-bold truncate", styles.text)}>
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
                    {task.description}
                  </div>
                )}
                {task.time && (
                  <div className="flex items-center gap-1 text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-1">
                    <Clock size={10} />
                    <span>{task.time}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-900 rounded-2xl bg-white dark:bg-zinc-950/45 overflow-x-auto shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex min-w-[840px] divide-x divide-zinc-200 dark:divide-zinc-900">
        {columns}
      </div>
    </div>
  );
}
