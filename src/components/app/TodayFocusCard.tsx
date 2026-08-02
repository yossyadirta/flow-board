"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, Timer, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isToday, isPast, startOfDay } from "date-fns";
import { Task } from "@/types/task";
import { Board } from "@/types/board";
import { BOARD_ICONS_MAP, BoardIconId } from "@/components/app/board/BoardIcons";
import { cn } from "@/lib/utils";

interface TodayFocusCardProps {
  className?: string;
  tasks: Task[];
  boards: Board[];
  currentUserId: string | null;
}

interface FocusTaskRowProps {
  task: Task;
  boards: Board[];
  onClick: () => void;
  urgency: "overdue" | "today" | "in-progress";
}

const urgencyConfig = {
  overdue: {
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0",
    label: "Overdue",
  },
  today: {
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
    label: "Due Today",
  },
  "in-progress": {
    dot: "bg-indigo-500",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-0",
    label: "Active",
  },
};

function FocusTaskRow({ task, boards, onClick, urgency }: FocusTaskRowProps) {
  const board = boards.find((b) => b.id === task.boardId);
  const emoji = BOARD_ICONS_MAP[board?.icon as BoardIconId]?.emoji || "📋";
  const config = urgencyConfig[urgency];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/60 transition-colors text-left group"
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0 mt-0.5", config.dot)} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 w-full min-w-0">
          <span className="text-[10px] font-mono text-muted-foreground shrink-0 whitespace-nowrap">{task.key}</span>
          <span className="text-[10px] text-muted-foreground shrink-0">·</span>
          <span className="text-[10px] text-muted-foreground truncate min-w-0">{emoji} {board?.name || "Unknown"}</span>
        </div>
      </div>
      {task.dueDate && (
        <span className="text-[10px] text-muted-foreground shrink-0">
          {urgency === "today" ? "Today" : format(new Date(task.dueDate), "MMM dd")}
        </span>
      )}
    </button>
  );
}

export function TodayFocusCard({ tasks, boards, currentUserId, className }: TodayFocusCardProps) {
  const router = useRouter();

  const { overdueTasks, dueTodayTasks, inProgressTasks, hasAnything } = useMemo(() => {
    const now = startOfDay(new Date());

    const overdueTasks = tasks.filter(
      (t) => t.status !== "done" && t.dueDate && isPast(startOfDay(new Date(t.dueDate))) && !isToday(new Date(t.dueDate))
    ).slice(0, 4);

    const dueTodayTasks = tasks.filter(
      (t) => t.status !== "done" && t.dueDate && isToday(new Date(t.dueDate))
    ).slice(0, 4);

    const alreadyShown = new Set([...overdueTasks, ...dueTodayTasks].map((t) => t.id));
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress" && !alreadyShown.has(t.id)
    ).slice(0, 3);

    const hasAnything = overdueTasks.length > 0 || dueTodayTasks.length > 0 || inProgressTasks.length > 0;

    return { overdueTasks, dueTodayTasks, inProgressTasks, hasAnything };
  }, [tasks]);

  const handleTaskClick = (task: Task) => {
    const board = boards.find((b) => b.id === task.boardId);
    if (board) router.push(`/app/board/${board.key}`);
  };

  return (
    <Card className={cn("bg-card/80 backdrop-blur-xl border border-border/40 shadow-sm ring-1 ring-white/5 flex flex-col p-0 gap-0 h-full overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="shrink-0 px-3 pt-3 pb-2">
        <CardTitle className="text-sm md:text-base flex items-center">
          Today's Focus
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          {hasAnything
            ? `${overdueTasks.length + dueTodayTasks.length + inProgressTasks.length} items need your attention`
            : "You're all caught up for today!"}
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-1.5 pt-1 min-h-0">
        {!hasAnything ? (
          <div className="flex flex-col items-center justify-center h-full py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Nothing pending today</p>
            <p className="text-xs text-muted-foreground mt-1">Enjoy your free time!</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-0.5 pb-2">
              {overdueTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 px-2 py-1">
                    <AlertTriangle className="h-3 w-3 text-rose-500" />
                    <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider">
                      Overdue · {overdueTasks.length}
                    </span>
                  </div>
                  {overdueTasks.map((task) => (
                    <FocusTaskRow
                      key={task.id}
                      task={task}
                      boards={boards}
                      onClick={() => handleTaskClick(task)}
                      urgency="overdue"
                    />
                  ))}
                </div>
              )}

              {dueTodayTasks.length > 0 && (
                <div className={overdueTasks.length > 0 ? "mt-2" : ""}>
                  <div className="flex items-center gap-1 px-2 py-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">
                      Due Today · {dueTodayTasks.length}
                    </span>
                  </div>
                  {dueTodayTasks.map((task) => (
                    <FocusTaskRow
                      key={task.id}
                      task={task}
                      boards={boards}
                      onClick={() => handleTaskClick(task)}
                      urgency="today"
                    />
                  ))}
                </div>
              )}

              {inProgressTasks.length > 0 && (
                <div className={(overdueTasks.length > 0 || dueTodayTasks.length > 0) ? "mt-2" : ""}>
                  <div className="flex items-center gap-1 px-2 py-1">
                    <Timer className="h-3 w-3 text-indigo-500" />
                    <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">
                      In Progress · {inProgressTasks.length}
                    </span>
                  </div>
                  {inProgressTasks.map((task) => (
                    <FocusTaskRow
                      key={task.id}
                      task={task}
                      boards={boards}
                      onClick={() => handleTaskClick(task)}
                      urgency="in-progress"
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
