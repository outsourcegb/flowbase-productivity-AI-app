"use client";

import React, { useState } from "react";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView } from "@/components/calendar/week-view";
import { DraftsPanel } from "@/components/calendar/drafts-panel";
import { TaskDialog } from "@/components/calendar/task-dialog";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: string | null; // YYYY-MM-DD or null for drafts
  time?: string;       // e.g. "09:30 AM" or "All Day"
  duration?: number;   // in minutes
  category: "meeting" | "design" | "client" | "planning" | "marketing" | "personal";
}

const CATEGORIES = {
  meeting: { label: "Meetings", color: "#6366f1", bg: "rgba(99, 102, 241, 0.15)", text: "#6366f1" },
  design: { label: "Design / Product", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b" },
  client: { label: "Client / External", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", text: "#10b981" },
  planning: { label: "Planning / Sprint", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6" },
  marketing: { label: "Content / Marketing", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.15)", text: "#f43f5e" },
  personal: { label: "Personal / Other", color: "#64748b", bg: "rgba(100, 116, 139, 0.15)", text: "#64748b" },
};

const CATEGORY_STYLES = {
  meeting: {
    badge: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    monthTask: "bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/25 border-l-2",
    weekTask: "bg-indigo-500/10 border-l-4 border-l-indigo-500 border-y-zinc-200/50 border-r-zinc-200/50 dark:border-y-zinc-800 dark:border-r-zinc-800 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-500/15",
    dot: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400"
  },
  design: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    monthTask: "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border-l-2",
    weekTask: "bg-amber-500/10 border-l-4 border-l-amber-500 border-y-zinc-200/50 border-r-zinc-200/50 dark:border-y-zinc-800 dark:border-r-zinc-800 text-amber-900 dark:text-amber-200 hover:bg-amber-500/15",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400"
  },
  client: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    monthTask: "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-l-2",
    weekTask: "bg-emerald-500/10 border-l-4 border-l-emerald-500 border-y-zinc-200/50 border-r-zinc-200/50 dark:border-y-zinc-800 dark:border-r-zinc-800 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/15",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400"
  },
  planning: {
    badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    monthTask: "bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 border-l-2",
    weekTask: "bg-blue-500/10 border-l-4 border-l-blue-500 border-y-zinc-200/50 border-r-zinc-200/50 dark:border-y-zinc-800 dark:border-r-zinc-800 text-blue-900 dark:text-blue-200 hover:bg-blue-500/15",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400"
  },
  marketing: {
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    monthTask: "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 border-l-2",
    weekTask: "bg-rose-500/10 border-l-4 border-l-rose-500 border-y-zinc-200/50 border-r-zinc-200/50 dark:border-y-zinc-800 dark:border-r-zinc-800 text-rose-900 dark:text-rose-200 hover:bg-rose-500/15",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400"
  },
  personal: {
    badge: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
    monthTask: "bg-slate-500/15 border-slate-500 text-slate-600 dark:text-slate-400 hover:bg-slate-500/25 border-l-2",
    weekTask: "bg-slate-500/10 border-l-4 border-l-slate-500 border-y-zinc-200/50 border-r-zinc-200/50 dark:border-y-zinc-800 dark:border-r-zinc-800 text-slate-900 dark:text-slate-200 hover:bg-slate-500/15",
    dot: "bg-slate-500",
    text: "text-slate-600 dark:text-slate-400"
  },
};

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Design review specs",
    description: "Go over final layout drafts",
    date: "2026-05-02",
    time: "10:00 AM",
    duration: 60,
    category: "design",
  },
  {
    id: "t2",
    title: "Team Standup meeting",
    description: "Daily status checks",
    date: "2026-05-03",
    time: "09:30 AM",
    duration: 30,
    category: "meeting",
  },
  {
    id: "t3",
    title: "Client discovery call",
    description: "Kickoff call for design sprint",
    date: "2026-05-03",
    time: "02:00 PM",
    duration: 45,
    category: "client",
  },
  {
    id: "t4",
    title: "Sprint review session",
    description: "Analyze timeline gaps",
    date: "2026-05-05",
    time: "11:00 AM",
    duration: 90,
    category: "planning",
  },
  {
    id: "t5",
    title: "Content shooting day",
    description: "Shoot videos for marketing",
    date: "2026-05-15",
    time: "All Day",
    category: "marketing",
  },
  {
    id: "d1",
    title: "Review analytics funnel",
    description: "Unscheduled conversion check",
    date: null,
    category: "planning",
  },
  {
    id: "d2",
    title: "Prepare invoice summaries",
    description: "Draft monthly billing reports",
    date: null,
    category: "personal",
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  
  // Drag and Drop active states
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDragTargetDate, setActiveDragTargetDate] = useState<string | null>(null);

  // Core Tasks state initialization
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Dialog form variables
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formCategory, setFormCategory] = useState<keyof typeof CATEGORIES>("meeting");

  // Load tasks from Neon Database on mount
  React.useEffect(() => {
    const loadDbTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          // Load database tasks if any exist; otherwise, fall back to initial mockup data
          if (data && data.length > 0) {
            setTasks(data);
          }
        }
      } catch (err) {
        console.error("Failed to load tasks from DB:", err);
      }
    };
    loadDbTasks();
  }, []);

  const navigateMonth = (direction: "prev" | "next") => {
    const amount = direction === "prev" ? -1 : 1;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverCell = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    setActiveDragTargetDate(targetDateStr);
  };

  const handleDragLeaveCell = () => {
    setActiveDragTargetDate(null);
  };

  const handleDropOnCell = async (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const id = e.dataTransfer.getData("text/plain");
    
    // Strict format + calendar date validity check
    const formatMatch = /^\d{4}-\d{2}-\d{2}$/.test(targetDateStr);
    const parsedDate = new Date(targetDateStr);
    const isValidCalendarDate = formatMatch && !isNaN(parsedDate.getTime());
    const targetTask = tasks.find((t) => t.id === id);
    
    if (id && isValidCalendarDate && targetTask) {
      const updated = { ...targetTask, date: targetDateStr };

      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error("Failed to sync drag update to DB:", err);
      }
    }
    
    setDraggedTaskId(null);
    setActiveDragTargetDate(null);
  };

  const handleDropOnDrafts = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const id = e.dataTransfer.getData("text/plain");
    const targetTask = tasks.find((t) => t.id === id);
    
    if (id && targetTask) {
      const updated = { ...targetTask, date: null, time: undefined };

      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, date: null, time: null }),
        });
      } catch (err) {
        console.error("Failed to sync draft drop to DB:", err);
      }
    }
    setDraggedTaskId(null);
  };

  // Dialog management
  const openNewTaskDialog = (initialDateStr: string | null = null) => {
    setEditingTask(null);
    setFormTitle("");
    setFormDesc("");
    setFormDate(initialDateStr || "");
    setFormTime("");
    setFormCategory("meeting");
    setIsDialogOpen(true);
  };

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description || "");
    setFormDate(task.date || "");
    setFormTime(task.time || "");
    setFormCategory(task.category);
    setIsDialogOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = formTitle.trim();
    if (!cleanTitle) return;

    const isEditing = !!editingTask;
    const tempId = isEditing ? editingTask.id : `task_${Date.now()}`;

    const taskData: Task = {
      id: tempId,
      title: cleanTitle,
      description: formDesc.trim() ? formDesc.trim() : undefined,
      date: formDate ? formDate : null,
      time: formTime.trim() ? formTime.trim() : undefined,
      category: formCategory,
    };

    // Optimistic update
    if (isEditing) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? taskData : t)));
    } else {
      setTasks((prev) => [...prev, taskData]);
    }
    setIsDialogOpen(false);

    try {
      const res = await fetch("/api/tasks", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        const synced = await res.json();
        // Update client task with server data schema
        setTasks((prev) => prev.map((t) => (t.id === tempId ? synced : t)));
      }
    } catch (err) {
      console.error("Failed to save task to DB:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsDialogOpen(false);

    try {
      await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete task from DB:", err);
    }
  };

  return (
    <main className="relative flex-1 box-border bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col md:flex-row h-auto md:h-screen overflow-y-auto md:overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -z-10 w-[300px] h-[300px] bg-purple-500/5 dark:bg-purple-500/2 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-[250px] h-[250px] bg-sky-500/5 dark:bg-sky-500/2 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Calendar View Container (Left 75%) */}
      <div className="flex-1 flex flex-col h-auto md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-900">
        
        <CalendarHeader 
          currentDate={currentDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          navigateMonth={navigateMonth}
          jumpToToday={jumpToToday}
        />

        {/* Calendar content views */}
        <div className="flex-1 overflow-auto p-4 box-border">
          {viewMode === "month" ? (
            <MonthView 
              currentDate={currentDate}
              tasks={tasks}
              draggedTaskId={draggedTaskId}
              activeDragTargetDate={activeDragTargetDate}
              categoryStyles={CATEGORY_STYLES}
              handleDragStart={handleDragStart}
              handleDragOverCell={handleDragOverCell}
              handleDragLeaveCell={handleDragLeaveCell}
              handleDropOnCell={handleDropOnCell}
              openNewTaskDialog={openNewTaskDialog}
              openEditTaskDialog={openEditTaskDialog}
            />
          ) : (
            <WeekView 
              currentDate={currentDate}
              tasks={tasks}
              draggedTaskId={draggedTaskId}
              activeDragTargetDate={activeDragTargetDate}
              categoryStyles={CATEGORY_STYLES}
              handleDragStart={handleDragStart}
              handleDragOverCell={handleDragOverCell}
              handleDragLeaveCell={handleDragLeaveCell}
              handleDropOnCell={handleDropOnCell}
              openEditTaskDialog={openEditTaskDialog}
            />
          )}
        </div>
      </div>

      {/* Right side Draft Task Panel (Right 25%) */}
      <DraftsPanel 
        tasks={tasks}
        draggedTaskId={draggedTaskId}
        categoryStyles={CATEGORY_STYLES}
        categories={CATEGORIES}
        handleDragStart={handleDragStart}
        handleDropOnDrafts={handleDropOnDrafts}
        openNewTaskDialog={openNewTaskDialog}
        openEditTaskDialog={openEditTaskDialog}
      />

      {/* Task Creation & Editing Modal Dialog */}
      <TaskDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingTask={editingTask}
        categories={CATEGORIES}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formDate={formDate}
        setFormDate={setFormDate}
        formTime={formTime}
        setFormTime={setFormTime}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        handleSaveTask={handleSaveTask}
        handleDeleteTask={handleDeleteTask}
      />
    </main>
  );
}
