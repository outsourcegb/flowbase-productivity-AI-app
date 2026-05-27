"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Trello,
  FileText,
  Presentation,
  Compass,
  Hammer,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Workspace",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#38bdf8" },
      { name: "Spaces", href: "/dashboard/spaces", icon: Compass, color: "#14b8a6" },
    ],
  },
  {
    label: "Productivity",
    items: [
      { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Sparkles, color: "#a855f7" },
      { name: "Task Board", href: "/dashboard/tasks", icon: Trello, color: "#f97316" },
      { name: "Whiteboard", href: "/dashboard/whiteboard", icon: Presentation, color: "#ec4899" },
      { name: "Notes", href: "/dashboard/notes", icon: FileText, color: "#eab308" },
      { name: "Calendar", href: "/dashboard/calendar", icon: Calendar, color: "#22c55e" },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "AI Template Builder", href: "/dashboard/templates", icon: Hammer, color: "#f43f5e" },
      { name: "Settings", href: "/dashboard/settings", icon: Settings, color: "#94a3b8" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(nextState));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Prevent CLS (Cumulative Layout Shift) by rendering a visual skeleton matching the exact dimension layout
  if (!isMounted) {
    return (
      <div 
        className={cn(
          "min-h-screen bg-zinc-50/70 dark:bg-zinc-950/40 border-r border-zinc-200/80 dark:border-zinc-900 box-border animate-pulse",
          isCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      />
    );
  }

  return (
    <aside
      className={cn(
        "min-h-screen bg-zinc-50/70 dark:bg-zinc-950/40 border-r border-zinc-200/80 dark:border-zinc-900 flex flex-col relative transition-all duration-300 ease-in-out box-border",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Sidebar Header: Logo & App Name */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-zinc-200/80 dark:border-zinc-900 box-border justify-between",
          isCollapsed ? "px-[18px] justify-center" : "px-5"
        )}
      >
        <div className="flex items-center gap-2.5">
          {/* Logo Emblem */}
          <div
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-sky-400 flex items-center justify-center font-bold text-white text-lg shadow-[0_0_12px_rgba(168,85,247,0.35)] animate-pulse"
          >
            Ω
          </div>
          {!isCollapsed && (
            <span className="font-bold text-[1.05rem] tracking-tight text-zinc-800 dark:text-zinc-100 font-sans">
              Antigravity
            </span>
          )}
        </div>

        {/* Collapse Toggle Handle */}
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-900"
          >
            <ChevronLeft size={16} />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-[76px] -right-3 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-md flex items-center justify-center z-40"
        >
          <ChevronRight size={12} />
        </Button>
      )}

      {/* Navigation List */}
      <nav className="flex-1 p-3 flex flex-col gap-5 box-border overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            {/* Group Label header (hidden when collapsed) */}
            {!isCollapsed ? (
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 px-3 mb-1 uppercase tracking-wider">
                {group.label}
              </span>
            ) : (
              <div className="h-[1px] bg-zinc-200/60 dark:bg-zinc-900 mx-2 my-1" />
            )}

            {/* Group items mapping */}
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              const linkElement = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 box-border border-y border-r border-l-3 border-transparent w-full relative overflow-hidden group/item",
                    isCollapsed ? "justify-center" : "justify-start",
                    isActive 
                      ? "text-zinc-950 dark:text-white font-semibold rounded-l-none rounded-r-lg border-l-current" 
                      : "font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/20 dark:hover:bg-zinc-900/20"
                  )}
                  style={
                    isActive
                      ? ({
                          "--tw-border-opacity": "1",
                          borderColor: `transparent transparent transparent ${item.color}`,
                          backgroundColor: `${item.color}09`,
                          paddingLeft: "9px",
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <Icon
                    size={16}
                    style={{
                      color: item.color,
                      strokeWidth: isActive ? "2.5px" : "2px",
                      filter: isActive ? `drop-shadow(0 0 8px ${item.color}55)` : "none",
                    }}
                    className={cn(
                      "flex-shrink-0 transition-transform duration-200",
                      !isActive && "group-hover/item:scale-110"
                    )}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href} delayDuration={50}>
                    <TooltipTrigger asChild>
                      {linkElement}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <React.Fragment key={item.href}>{linkElement}</React.Fragment>;
            })}
          </div>
        ))}
      </nav>

      {/* Footer Details with Dropdown Trigger */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-900 flex flex-col gap-2.5 box-border">
        {/* Theme Toggle Button */}
        <div className={cn("flex w-full items-center", isCollapsed ? "justify-center" : "justify-between px-1")}>
          {!isCollapsed && <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Theme Mode</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-7 w-7 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} className="text-blue-500" />}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/40 p-1 rounded-lg transition-colors",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <Avatar className="w-7 h-7 flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
                {isLoaded && user?.imageUrl ? (
                  <AvatarImage src={user.imageUrl} alt={user.fullName || "User Profile"} />
                ) : null}
                <AvatarFallback className="bg-purple-900 text-purple-200 text-[10px]">
                  {user?.firstName?.slice(0, 1) || "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 truncate">
                    {user?.fullName || "User Account"}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                    {user?.primaryEmailAddress?.emailAddress || "Workspace Account"}
                  </span>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300" align="end">
            <DropdownMenuLabel className="text-zinc-400 text-xs">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:text-zinc-900 dark:focus:text-zinc-100 cursor-pointer text-xs">
              <Link href="/dashboard/settings" className="w-full flex items-center">
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:text-destructive cursor-pointer text-rose-500 text-xs">
              <SignOutButton>
                <div className="w-full flex items-center gap-2">
                  <LogOut size={13} />
                  <span>Log Out</span>
                </div>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isCollapsed && (
          <Link
            href="#"
            className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 text-[10px] mt-0.5 transition-colors"
          >
            <HelpCircle size={13} />
            <span>Support & Help</span>
          </Link>
        )}
      </div>
    </aside>
  );
}






