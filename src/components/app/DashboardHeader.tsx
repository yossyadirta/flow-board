"use client";

import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userName: string | null;
  tasks: Task[];
  onNewBoard: () => void;
  className?: string;
}

export function DashboardHeader({ userName, tasks, onNewBoard, className }: DashboardHeaderProps) {
  const { subtitle, type } = useMemo(() => {
    let overdue = 0;
    let dueToday = 0;
    let inProgress = 0;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    tasks.forEach(t => {
      if (t.status === "done") return;
      if (t.status === "in-progress") inProgress++;
      if (t.dueDate) {
        const d = new Date(t.dueDate);
        d.setHours(0,0,0,0);
        if (d < today) overdue++;
        else if (d.getTime() === today.getTime()) dueToday++;
      }
    });

    if (overdue > 0) return { subtitle: `${overdue} overdue task${overdue > 1 ? 's' : ''} need attention`, type: "alert" };
    if (dueToday > 0) return { subtitle: `${dueToday} task${dueToday > 1 ? 's' : ''} due today`, type: "focus" };
    if (inProgress > 0) return { subtitle: `${inProgress} active task${inProgress > 1 ? 's' : ''} in progress`, type: "active" };
    if (tasks.length > 0) return { subtitle: "No urgent tasks", type: "chill" };
    return { subtitle: "Ready to get started?", type: "chill" };
  }, [tasks]);

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 mb-1", className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Overview
        </h1>
        
        {/* Dynamic Status Subtitle */}
        <div className="flex items-center gap-2 mt-1.5">
          {/* Subtle Status Dot (no animation) */}
          <div className="relative flex items-center justify-center">
            {type === "alert" && <span className="inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>}
            {type === "focus" && <span className="inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>}
            {type === "active" && <span className="inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>}
            {type === "chill" && <span className="inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <Button
        data-onboarding="create-board-btn"
        size="sm"
        className="shadow-sm hover:shadow-md transition-all rounded-full px-5 w-full sm:w-auto shrink-0 cursor-pointer"
        onClick={onNewBoard}
      >
        <Plus className="h-4 w-4 mr-1.5" />
        New Board
      </Button>
    </div>
  );
}
