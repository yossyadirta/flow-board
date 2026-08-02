import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Board } from "@/types/board";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface UpcomingDeadlinesCardProps {
  hasUpcomingTasks: boolean;
  upcomingTasks: Task[];
  boards: Board[];
  getBoardName: (id: string) => string;
  className?: string;
}

export function UpcomingDeadlinesCard({
  hasUpcomingTasks,
  upcomingTasks,
  boards,
  getBoardName,
  className,
}: UpcomingDeadlinesCardProps) {
  const router = useRouter();

  return (
    <Card className={cn("flex flex-col border-0 shadow-none bg-card p-0 gap-0 h-full overflow-hidden", className)}>
      <CardHeader className="shrink-0 px-3 pt-3 pb-2">
        <CardTitle className="text-sm md:text-base flex items-center">
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 xl:min-h-0">
        {!hasUpcomingTasks ? (
          <div className="flex items-center justify-center h-full py-10">
            <p className="text-sm text-center text-muted-foreground">
              No tasks with approaching deadlines.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-auto xl:h-full">
            <div className="flex flex-col">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() =>
                    router.push(
                      `/app/board/${boards.find((b) => b.id === task.boardId)?.key || task.boardId}`,
                    )
                  }
                  className="flex flex-col gap-1 px-3 py-2 border-b border-border/40 hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-xs md:text-sm group-hover:text-primary transition-colors truncate max-w-37.5 md:max-w-45">
                      {task.title}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] md:text-[10px] whitespace-nowrap"
                    >
                      {format(new Date(task.dueDate!), "MMM dd")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground mt-1">
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded truncate max-w-12.5 md:max-w-15">
                      {task.key}
                    </span>
                    <span>•</span>
                    <span className="truncate">
                      {getBoardName(task.boardId)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
