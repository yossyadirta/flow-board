"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  AlignLeft,
  ArrowUpDown,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarIcon,
  CheckCircle2,
  Circle,
  Timer,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn, formatDueDate } from "@/lib/utils";
import { Task } from "@/types/task";
import { TASK_STATUS } from "@/schemas/task.schemas";
import { ModalState } from "@/types/state";
import { useIsOverflow } from "@/hooks/useIsOverflow";

type Props = {
  tasks: Task[];
  modalState: ModalState;
  setModalState: (data: ModalState) => void;
  boardId: string;
};

type SortOption =
  | "dueDate-asc"
  | "dueDate-desc"
  | "title-asc"
  | "title-desc"
  | "key-asc"
  | "key-desc";

export const BoardListView = ({ tasks, setModalState, boardId }: Props) => {
  const [sortOption, setSortOption] = useState<SortOption>("dueDate-asc");

  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    TASK_STATUS.forEach((status) => {
      groups[status.value] = [];
    });

    tasks.forEach((task) => {
      if (groups[task.status]) groups[task.status].push(task);
    });

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        if (sortOption.startsWith("dueDate")) {
          const dateA = new Date(a.dueDate || "9999-12-31").getTime();
          const dateB = new Date(b.dueDate || "9999-12-31").getTime();
          return sortOption.endsWith("asc") ? dateA - dateB : dateB - dateA;
        } else if (sortOption.startsWith("key")) {
          const numA = parseInt(a.key?.split("-")[1] || "0");
          const numB = parseInt(b.key?.split("-")[1] || "0");
          return sortOption.endsWith("asc") ? numA - numB : numB - numA;
        } else {
          return sortOption.endsWith("asc")
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });
    });

    return groups;
  }, [tasks, sortOption]);

  const defaultOpenGroups = TASK_STATUS.map((s) => s.value);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "text-emerald-500",
          bg: "bg-emerald-500/5",
          border: "border-emerald-500/20",
        };
      case "in-progress":
        return {
          icon: <Timer className="h-4 w-4" />,
          color: "text-blue-500",
          bg: "bg-blue-500/5",
          border: "border-blue-500/20",
        };
      default:
        return {
          icon: <Circle className="h-4 w-4" />,
          color: "text-slate-400",
          bg: "bg-slate-500/5",
          border: "border-slate-500/20",
        };
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      <div className="flex items-center justify-end mb-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium bg-background shadow-sm"
            >
              <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Due Date
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSortOption("dueDate-asc")}>
              Earliest First
              {sortOption === "dueDate-asc" && (
                <CheckCircle2 className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("dueDate-desc")}>
              Latest First
              {sortOption === "dueDate-desc" && (
                <CheckCircle2 className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Task ID
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSortOption("key-asc")}>
              Oldest (ID 1-9)
              {sortOption === "key-asc" && (
                <CheckCircle2 className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("key-desc")}>
              Newest (ID 9-1)
              {sortOption === "key-desc" && (
                <CheckCircle2 className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          <div className="pr-4 pb-10">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                <p className="text-sm font-medium">
                  No tasks match your filter.
                </p>
              </div>
            ) : (
              <Accordion
                type="multiple"
                defaultValue={defaultOpenGroups}
                className="space-y-4"
              >
                {TASK_STATUS.map((status) => {
                  const groupTasks = groupedTasks[status.value] || [];

                  // Opsional: Jika kamu ingin tetap menampilkan status kosong agar user bisa add task di sana,
                  // kamu bisa menghapus baris "if (groupTasks.length === 0) return null;"
                  // Tapi jika ingin di-hide saat kosong, biarkan saja.
                  if (groupTasks.length === 0) return null;

                  const config = getStatusConfig(status.value);

                  return (
                    <AccordionItem
                      key={status.value}
                      value={status.value}
                      className="border-none"
                    >
                      <AccordionTrigger
                        className={cn(
                          "flex items-center justify-between py-1.5 px-3 rounded-lg hover:no-underline transition-all group",
                          config.bg,
                          config.border,
                          "border shadow-sm",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90 shrink-0" />
                          <div
                            className={cn(
                              "flex items-center gap-2 font-bold text-sm tracking-tight",
                              config.color,
                            )}
                          >
                            {config.icon}
                            {status.label}
                            <span className="ml-1 opacity-50 font-medium">
                              ({groupTasks.length})
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent hover:border-border shadow-sm transition-all"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setModalState({
                              type: "add-task",
                              status: status.value,
                              boardId,
                            });
                          }}
                        >
                          <span className="mr-1.5 text-base leading-none font-light">
                            +
                          </span>
                          Add Task
                        </Button>
                      </AccordionTrigger>

                      <AccordionContent className="pt-3 pb-2 ml-7 border-l-2 border-muted/30 pl-4 space-y-2">
                        {groupTasks.map((task) => (
                          <TaskListItem
                            key={task.id}
                            task={task}
                            setModalState={setModalState}
                          />
                        ))}

                        <div className="pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-transparent hover:border-border border-dashed transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalState({
                                type: "add-task",
                                status: status.value,
                                boardId,
                              });
                            }}
                          >
                            <span className="flex items-center">
                              <span className="text-xl leading-none mr-2 font-light mb-0.5">
                                +
                              </span>
                              Add Task
                            </span>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const TaskListItem = ({
  task,
  setModalState,
}: {
  task: Task;
  setModalState: (data: ModalState) => void;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const isOverflow = useIsOverflow(textRef);

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-accent/5 transition-all cursor-pointer shadow-sm relative overflow-hidden",
        task.cover?.type === "color" && "border-l-4",
      )}
      style={
        task.cover?.type === "color"
          ? { borderLeftColor: task.cover.value }
          : {}
      }
      onClick={() => setModalState({ type: "edit-task", data: task })}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="font-mono text-[10px] font-bold text-muted-foreground/60 shrink-0 tracking-tighter">
          {task.key}
        </span>

        <div className="flex items-center gap-1.5 text-muted-foreground/40 shrink-0">
          {task.cover?.type === "image" && (
            <ImageIcon className="h-3.5 w-3.5" />
          )}
          {task.description && <AlignLeft className="h-3.5 w-3.5" />}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <span
              ref={textRef}
              className="truncate font-medium text-sm text-foreground/90"
            >
              {task.title}
            </span>
          </TooltipTrigger>
          {isOverflow && (
            <TooltipContent side="top">{task.title}</TooltipContent>
          )}
        </Tooltip>
      </div>

      <div className="flex items-center gap-3 shrink-0 pl-4">
        {task.assignee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-6 h-6 border border-background shadow-sm shrink-0">
                <AvatarFallback 
                  className="text-white text-[10px]"
                  style={{ backgroundColor: task.assignee.bg_color || "#9CA3AF" }}
                >
                  {task.assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Assigned to {task.assignee.name}</span>
            </TooltipContent>
          </Tooltip>
        )}

        {task.dueDate && (
          <div className="flex items-center text-[11px] font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border">
            <CalendarIcon className="mr-1.5 h-3 w-3" />
            {formatDueDate(task.dueDate)}
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setModalState({ type: "edit-task", data: task });
              }}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete", task.id);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BoardListView;
