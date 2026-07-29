"use client";

import React, { useMemo } from "react";
import { Task } from "@/types/task";
import { BOARD_ICONS_MAP } from "@/components/app/board/BoardIcons";
import { formatDueDate, cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Circle,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { Board } from "@/types/board";
import TaskItem from "@/components/app/task/TaskItem";
import { ModalState } from "@/types/state";

type Props = {
  tasks: Task[];
  boards: Board[];
  onTaskClick: (task: Task) => void;
  modalState: ModalState;
  setModalState: (data: ModalState) => void;
};

const STATUS_CONFIG = {
  "todo": { label: "To Do", icon: Circle, color: "text-amber-500", bg: "bg-amber-500/10" },
  "in-progress": { label: "In Progress", icon: Timer, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  "done": { label: "Done", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
};

export function TasksKanbanView({ tasks, boards, onTaskClick, modalState, setModalState }: Props) {
  const getBoardDetails = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return { name: "Unknown Board", icon: "briefcase" };
    return { name: board.name, icon: board.icon };
  };

  const columns = useMemo(() => {
    const cols: Record<string, Task[]> = {
      "todo": [],
      "in-progress": [],
      "done": [],
    };
    
    tasks.forEach(task => {
      if (cols[task.status]) {
        cols[task.status].push(task);
      } else {
        cols["todo"].push(task);
      }
    });

    return cols;
  }, [tasks]);

  return (
    <div className="flex h-full gap-6 px-6 overflow-x-auto pb-4 pt-6">
      {(Object.keys(columns) as Array<keyof typeof STATUS_CONFIG>).map((statusKey) => {
        const columnTasks = columns[statusKey];
        const config = STATUS_CONFIG[statusKey];
        const StatusIcon = config.icon;

        return (
          <div key={statusKey} className="flex-shrink-0 w-80 flex flex-col max-h-full">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <StatusIcon className={cn("w-4 h-4", config.color)} />
                <h3 className="font-semibold text-sm">{config.label}</h3>
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="space-y-3 pb-4">
                {columnTasks.map((task) => {
                  const boardConfig = getBoardDetails(task.boardId);
                  const boardEmoji = BOARD_ICONS_MAP[boardConfig.icon as keyof typeof BOARD_ICONS_MAP]?.emoji || "💼";

                  return (
                    <div onClick={() => onTaskClick(task)}>
                      <TaskItem
                        key={task.id}
                        data={task}
                        modalState={modalState}
                        setModalState={setModalState}
                        disableDnD
                        hideAssignee
                        customBadge={
                          <div className="flex items-center gap-1.5 text-muted-foreground font-medium w-max text-xs mb-0.5">
                            <span className="text-[10px]">{boardEmoji}</span>
                            <span className="truncate max-w-[150px] uppercase tracking-wider text-[9px] font-semibold">{boardConfig.name}</span>
                          </div>
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
