"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: string | null;
  time?: string;
  duration?: number;
  category: "meeting" | "design" | "client" | "planning" | "marketing" | "personal";
}

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: Task | null;
  categories: Record<string, { label: string }>;
  formTitle: string;
  setFormTitle: (val: string) => void;
  formDesc: string;
  setFormDesc: (val: string) => void;
  formDate: string;
  setFormDate: (val: string) => void;
  formTime: string;
  setFormTime: (val: string) => void;
  formCategory: "meeting" | "design" | "client" | "planning" | "marketing" | "personal";
  setFormCategory: (val: "meeting" | "design" | "client" | "planning" | "marketing" | "personal") => void;
  handleSaveTask: (e: React.FormEvent) => void;
  handleDeleteTask: (id: string) => void;
}

export function TaskDialog({
  isOpen,
  onOpenChange,
  editingTask,
  categories,
  formTitle,
  setFormTitle,
  formDesc,
  setFormDesc,
  formDate,
  setFormDate,
  formTime,
  setFormTime,
  formCategory,
  setFormCategory,
  handleSaveTask,
  handleDeleteTask,
}: TaskDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {editingTask ? "Edit Workspace Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSaveTask} className="space-y-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Title</label>
            <input
              type="text"
              placeholder="Design sprint wrap..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</label>
            <textarea
              placeholder="Review conversion funnel adjustments..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[60px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date (Optional)</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Time (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none"
            >
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key} className="bg-zinc-50 dark:bg-zinc-900">
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="flex justify-between items-center pt-2">
            {editingTask ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDeleteTask(editingTask.id)}
                className="text-xs text-rose-500 border-rose-200/50 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <Trash2 size={14} className="mr-1.5" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-xs text-zinc-500"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
              >
                Save Task
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
