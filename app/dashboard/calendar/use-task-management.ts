import React, { useState, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string | null;
  time?: string;
  duration?: number;
  category: "meeting" | "design" | "client" | "planning" | "marketing" | "personal";
}

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

export function useTaskManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  
  // Drag and Drop active states
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDragTargetDate, setActiveDragTargetDate] = useState<string | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Dialog form variables
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formCategory, setFormCategory] = useState<Task["category"]>("meeting");

  const loadDbTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setTasks(data);
        }
      }
    } catch (err) {
      console.error("Failed to load tasks from DB:", err);
    }
  };

  // Sync tasks on mount & tab focus to avoid stale state
  useEffect(() => {
    loadDbTasks();
    window.addEventListener("focus", loadDbTasks);
    return () => {
      window.removeEventListener("focus", loadDbTasks);
    };
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
      const snapshot = [...tasks];
      const updated = { ...targetTask, date: targetDateStr };

      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      try {
        const res = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        if (!res.ok) {
          throw new Error("Failed to persist drag target");
        }
      } catch (err) {
        console.error("Failed to sync drag update, rolling back:", err);
        setTasks(snapshot); // Rollback
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
      const snapshot = [...tasks];
      const updated = { ...targetTask, date: null, time: undefined };

      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      try {
        const res = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, date: null, time: null }),
        });

        if (!res.ok) {
          throw new Error("Failed to persist drop to drafts");
        }
      } catch (err) {
        console.error("Failed to sync drafts drop, rolling back:", err);
        setTasks(snapshot); // Rollback
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
    
    // Non-colliding UUID generation fallback
    const tempId = isEditing 
      ? editingTask.id 
      : (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const taskData: Task = {
      id: tempId,
      title: cleanTitle,
      description: formDesc.trim() ? formDesc.trim() : undefined,
      date: formDate ? formDate : null,
      time: formTime.trim() ? formTime.trim() : undefined,
      category: formCategory,
    };

    const snapshot = [...tasks];

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
        setTasks((prev) => prev.map((t) => (t.id === tempId ? synced : t)));
      } else {
        throw new Error("Failed to save task to backend");
      }
    } catch (err) {
      console.error("Failed to save task, rolling back:", err);
      setTasks(snapshot); // Rollback
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const snapshot = [...tasks];
    
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsDialogOpen(false);

    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task from backend");
      }
    } catch (err) {
      console.error("Failed to delete task, rolling back:", err);
      setTasks(snapshot); // Rollback
    }
  };

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    tasks,
    setTasks,
    draggedTaskId,
    activeDragTargetDate,
    isDialogOpen,
    setIsDialogOpen,
    editingTask,
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
    navigateMonth,
    jumpToToday,
    handleDragStart,
    handleDragOverCell,
    handleDragLeaveCell,
    handleDropOnCell,
    handleDropOnDrafts,
    openNewTaskDialog,
    openEditTaskDialog,
    handleSaveTask,
    handleDeleteTask,
  };
}
