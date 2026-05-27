"use client";

import React from "react";
import { Plus, Menu, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: string | null;
  time?: string;
  duration?: number;
  category: "meeting" | "design" | "client" | "planning" | "marketing" | "personal";
}

interface DraftsPanelProps {
  tasks: Task[];
  draggedTaskId: string | null;
  categoryStyles: Record<string, { dot: string }>;
  categories: Record<string, { label: string }>;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDropOnDrafts: (e: React.DragEvent) => void;
  openNewTaskDialog: (dateStr: null) => void;
  openEditTaskDialog: (task: Task) => void;
}

export function DraftsPanel({
  tasks,
  draggedTaskId,
  categoryStyles,
  categories,
  handleDragStart,
  handleDropOnDrafts,
  openNewTaskDialog,
  openEditTaskDialog,
}: DraftsPanelProps) {
  const drafts = tasks.filter((task) => task.date === null);

  return (
    <div 
      className="w-full md:w-[280px] lg:w-[320px] h-auto md:h-full flex flex-col bg-zinc-50/70 dark:bg-zinc-950/40 backdrop-blur-md pb-8 md:pb-0"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropOnDrafts}
    >
      <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-900 flex justify-between items-center">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Menu size={16} className="text-zinc-400" />
          <span>Draft Tasks</span>
        </h3>
        <Button
          onClick={() => openNewTaskDialog(null)}
          size="icon"
          className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-sm"
        >
          <Plus size={15} />
        </Button>
      </div>

      <div className="mx-4 mt-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 text-[10px] text-purple-600 dark:text-purple-400 flex gap-2">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span>Drag tasks from here to schedule them. Drag items back to unschedule.</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
        {drafts.length === 0 ? (
          <div className="flex-1 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-xl flex flex-col items-center justify-center p-6 text-center text-zinc-400 min-h-[150px]">
            <span className="text-xs">No draft tasks</span>
            <span className="text-[10px] text-zinc-500 mt-1">Create one to start planning</span>
          </div>
        ) : (
          drafts.map((task) => {
            const styles = categoryStyles[task.category];
            const cat = categories[task.category];
            return (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => openEditTaskDialog(task)}
                className={cn(
                  "p-3 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-md active:scale-[0.98] transition-all flex flex-col gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
                  draggedTaskId === task.id && "opacity-40 scale-95"
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-snug truncate">
                    {task.title}
                  </span>
                  <span 
                    className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", styles.dot)}
                    title={cat.label}
                  />
                </div>
                {task.description && (
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
