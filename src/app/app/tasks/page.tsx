"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { useBoards } from "@/hooks/useBoards";
import { supabase } from "@/lib/supabase";
import { Task, TaskStatus } from "@/types/task";
import { BOARD_ICONS_MAP } from "@/components/app/board/BoardIcons";
import { formatDueDate, cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModalState } from "@/types/state";
import BoardModals from "@/components/app/BoardModals";
import {
  CheckCircle2,
  Circle,
  Timer,
  CalendarIcon,
  AlignLeft,
  ImageIcon,
  AlignJustify,
  SquareKanban,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksKanbanView } from "@/components/app/task/TasksKanbanView";
import { List, Table2, CalendarDays } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TasksTableView } from "@/components/app/task/TasksTableView";
import { TasksCalendarView } from "@/components/app/task/TasksCalendarView";

function MyTasksContent() {
  const { mappedTasks, isLoading: isTasksLoading, updateTaskContent } = useTasks();
  const { boards, isLoading: isBoardsLoading } = useBoards();

  const searchParams = useSearchParams();
  const router = useRouter();

  const filter = searchParams.get("filter") || "all";
  const view = searchParams.get("view") || "list";

  const [userId, setUserId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: null });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  const myTasks = useMemo(() => {
    if (!userId) return [];
    return mappedTasks
      .filter((task) => {
        if (task.assigneeId !== userId) return false;

        if (filter === "completed") return task.status === "done";

        // Hide completed tasks from other views to keep it clean
        if (task.status === "done" && filter !== "completed") return false;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (filter === "today") {
          if (!task.dueDate) return false;
          const d = new Date(task.dueDate);
          return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
        }

        if (filter === "next-7-days") {
          if (!task.dueDate) return false;
          const d = new Date(task.dueDate);
          const target = new Date(today);
          target.setDate(target.getDate() + 7);
          return d >= today && d <= target;
        }

        if (filter === "overdue") {
          if (!task.dueDate) return false;
          const d = new Date(task.dueDate);
          return d < today;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by status (Todo -> In Progress -> Done)
        const statusOrder = { "todo": 0, "in-progress": 1, "done": 2 };
        const aStatus = statusOrder[a.status] ?? 3;
        const bStatus = statusOrder[b.status] ?? 3;
        if (aStatus !== bStatus) return aStatus - bStatus;

        // Then by due date
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return aDate - bDate;
      });
  }, [mappedTasks, userId, filter]);

  const isLoading = isTasksLoading || isBoardsLoading || !userId;

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Done" };
      case "in-progress":
        return { icon: Timer, color: "text-blue-500", bg: "bg-blue-500/10", label: "In Progress" };
      default:
        return { icon: Circle, color: "text-muted-foreground", bg: "bg-muted", label: "To Do" };
    }
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    updateTaskContent({ ...task, status: newStatus });
  };

  const getBoardDetails = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return { name: "Unknown Board", icon: "briefcase" };
    return { name: board.name, icon: board.icon };
  };

  const handleViewChange = (newView: string) => {
    if (!newView) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.push(`?${params.toString()}`);
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="px-4 pt-4 md:px-6 md:pt-6 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tasks assigned to you across all boards
          </p>
        </div>

        <div className="flex items-center justify-between border-b px-4 md:px-6 mt-4 shrink-0">
          <Tabs value={view} onValueChange={handleViewChange}>
            <TabsList variant="line" className="border-none h-12 bg-transparent">
              <TabsTrigger
                value="list"
                className="flex items-center gap-2 cursor-pointer h-full"
              >
                <List
                  className={cn(
                    "h-5 w-5",
                    view === "list" ? "text-primary" : "",
                  )}
                />
                List
              </TabsTrigger>
              <TabsTrigger
                value="kanban"
                className="flex items-center gap-2 cursor-pointer h-full"
              >
                <SquareKanban
                  className={cn(
                    "h-5 w-5",
                    view === "kanban" ? "text-primary" : "",
                  )}
                />
                Kanban
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="flex items-center gap-2 cursor-pointer h-full"
              >
                <Table2
                  className={cn(
                    "h-5 w-5",
                    view === "table" ? "text-primary" : "",
                  )}
                />
                Table
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="flex items-center gap-2 cursor-pointer h-full"
              >
                <CalendarDays
                  className={cn(
                    "h-5 w-5",
                    view === "calendar" ? "text-primary" : "",
                  )}
                />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {isLoading ? (
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-5xl mx-auto space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          </ScrollArea>
        ) : myTasks.length === 0 ? (
          <ScrollArea className="flex-1">
            <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                {filter === "completed" ? "No completed tasks yet" : "You're all caught up!"}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                {filter === "completed"
                  ? "Finish some tasks to see them here."
                  : "You don't have any tasks assigned to you right now. Enjoy your free time!"}
              </p>
            </div>
          </ScrollArea>
        ) : view === "kanban" ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <TasksKanbanView
              tasks={myTasks}
              boards={boards}
              onTaskClick={(task) => setModalState({ type: "edit-task", data: task })}
              modalState={modalState}
              setModalState={setModalState}
            />
          </div>
        ) : view === "table" ? (
          <div className="flex-1 min-h-0">
            <TasksTableView
              tasks={myTasks}
              boards={boards}
              onTaskClick={(task) => setModalState({ type: "edit-task", data: task })}
            />
          </div>
        ) : view === "calendar" ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <TasksCalendarView
              tasks={myTasks}
              boards={boards}
              onTaskClick={(task) => setModalState({ type: "edit-task", data: task })}
              modalState={modalState}
              setModalState={setModalState}
            />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-5xl mx-auto">
              <div className="space-y-3">
                {myTasks.map((task) => {
                  const StatusIcon = getStatusConfig(task.status).icon;
                  const statusColor = getStatusConfig(task.status).color;
                  const statusBg = getStatusConfig(task.status).bg;
                  const boardConfig = getBoardDetails(task.boardId);
                  const boardEmoji = BOARD_ICONS_MAP[boardConfig.icon as keyof typeof BOARD_ICONS_MAP]?.emoji || "💼";

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer",
                        task.status === "done" && "opacity-60"
                      )}
                      onClick={() => setModalState({ type: "edit-task", data: task })}
                    >
                      {/* Status Dropdown */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={cn("flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-background shadow-sm border outline-none", statusBg)}>
                            <StatusIcon className={cn("w-4 h-4", statusColor)} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleStatusChange(task, "todo")}>
                              <Circle className="w-4 h-4 mr-2 text-muted-foreground" /> To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task, "in-progress")}>
                              <Timer className="w-4 h-4 mr-2 text-blue-500" /> In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task, "done")}>
                              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Done
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {task.key}
                          </span>
                          <h4 className={cn("text-sm font-semibold truncate", task.status === "done" && "line-through text-muted-foreground")}>
                            {task.title}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          {/* Board Badge */}
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                            <span>{boardEmoji}</span>
                            <span className="truncate max-w-[120px]">{boardConfig.name}</span>
                          </div>

                          {/* Due Date */}
                          {task.dueDate && (
                            <div className={cn("flex items-center gap-1",
                              task.status !== "done" && new Date(task.dueDate) < new Date() && "text-destructive font-medium"
                            )}>
                              <CalendarIcon size={12} />
                              {formatDueDate(new Date(task.dueDate))}
                            </div>
                          )}

                          {/* Indicators */}
                          <div className="flex items-center gap-2">
                            {task.description && <AlignLeft size={12} />}
                            {task.cover && task.cover.type !== "none" && <ImageIcon size={12} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        )}

        {/* Reusing BoardModals for Edit Task */}
        {modalState.type === "edit-task" && (
          <BoardModals
            modalState={modalState}
            closeModal={() => setModalState({ type: null })}
            actions={{} as any} // Dummy actions since EditTaskModal doesn't strictly need board actions for rendering
            dnd={{} as any}
            derived={{ currentBoard: boards.find(b => b.id === (modalState as any).data?.boardId) } as any}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

export default function MyTasksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyTasksContent />
    </Suspense>
  );
}
