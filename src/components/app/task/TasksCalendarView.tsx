"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { Board } from "@/types/board";
import { ModalState } from "@/types/state";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isValid,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlignLeft, ImageIcon, Circle, Timer, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_CONFIG = {
  "todo": { label: "To Do", icon: Circle, color: "text-amber-500", bg: "bg-amber-500/10" },
  "in-progress": { label: "In Progress", icon: Timer, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  "done": { label: "Done", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
};

type Props = {
  tasks: Task[];
  boards: Board[];
  onTaskClick: (task: Task) => void;
  modalState?: ModalState;
  setModalState?: (state: ModalState) => void;
};

export function TasksCalendarView({ tasks, boards, onTaskClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getBoardDetails = (boardId: string) => {
    return boards.find((b) => b.id === boardId) || { name: "Unknown Board", icon: "💼" };
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <h2 className="text-xl font-bold">{format(currentDate, dateFormat)}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
          <div className="flex items-center gap-1 ml-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekDays.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-[minmax(160px,1fr)] overflow-y-auto bg-muted/20 pb-12">
          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            // Get tasks for this day
            const dayTasks = tasks.filter((task) => {
              if (!task.dueDate) return false;
              const d = new Date(task.dueDate);
              if (!isValid(d)) return false;
              return isSameDay(d, day);
            });

            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[160px] border-r border-b p-2 flex flex-col gap-1.5 transition-colors hover:bg-muted/30 overflow-hidden",
                  !isCurrentMonth && "bg-muted/30 text-muted-foreground/50",
                  isToday && "bg-primary/5"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                      isToday && "bg-primary text-primary-foreground",
                      !isCurrentMonth && !isToday && "text-muted-foreground/50"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <ScrollArea className="flex-1 -mx-1 px-1">
                  <div className="flex flex-col gap-1.5 pb-2">
                    {dayTasks.map((task) => {
                      const board = getBoardDetails(task.boardId);
                      const statusConfig = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG["todo"];
                      const isDone = task.status === "done";

                      return (
                        <TooltipProvider key={task.id}>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => onTaskClick(task)}
                                className={cn(
                                  "flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-md cursor-pointer hover:brightness-95 dark:hover:brightness-110 transition-colors group overflow-hidden w-full",
                                  statusConfig.bg,
                                  statusConfig.color,
                                  isDone && "opacity-50"
                                )}
                              >
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusConfig.color.replace("text-", "bg-"))} />
                                <div className={cn("truncate font-medium", isDone && "line-through opacity-70")}>
                                  {task.title}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="space-y-1.5">
                                <p className="font-semibold">{task.title}</p>
                                {task.description && <p className="text-xs text-muted-foreground line-clamp-3">{task.description}</p>}
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t text-xs">
                                  <span className={cn("px-2 py-0.5 rounded-full", statusConfig.bg, statusConfig.color)}>
                                    {statusConfig.label}
                                  </span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
