import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BOARD_ICONS_MAP,
  BoardIconId,
} from "@/components/app/board/BoardIcons";
import { BarChart3 } from "lucide-react";
import { Board } from "@/types/board";

interface ProjectStatusListProps {
  boards: Board[];
  getBoardMetrics: (id: string) => {
    progress: number;
    done: number;
    remaining: number;
  };
}

export function ProjectStatusList({
  boards,
  getBoardMetrics,
}: ProjectStatusListProps) {
  const router = useRouter();

  return (
    <section className="flex-1 flex flex-col xl:min-h-0 xl:overflow-hidden pt-2">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <BarChart3 className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg md:text-xl font-semibold">Project Status</h2>
      </div>

      <ScrollArea className="h-auto xl:max-h-none xl:h-full pr-4 -mr-4">
        <div className="flex flex-col gap-3 pb-12 md:pb-0 sm:pb-0 xs:pb-0">
          {boards.map((board) => {
            const metrics = getBoardMetrics(board.id);
            const emoji =
              BOARD_ICONS_MAP[board.icon as BoardIconId]?.emoji || "📋";
            const isCompleted = metrics.progress === 100 && metrics.done > 0;

            return (
              <div
                key={board.id}
                onClick={() => router.push(`/app/board/${board.key || board.id}`)}
                className="p-3 md:p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                      {emoji}
                    </div>
                    <div>
                      <h3 className="font-medium leading-none mb-1 text-sm md:text-base line-clamp-1">
                        {board.name}
                      </h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        {board.key}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] md:text-xs shrink-0 ${isCompleted
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      : "bg-slate-100 dark:bg-slate-800"
                      }`}
                  >
                    {isCompleted ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] md:text-xs text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">
                      {metrics.progress}%
                    </span>
                    <span>
                      {metrics.done} / {metrics.done + metrics.remaining} Tasks
                    </span>
                  </div>
                  <Progress
                    value={metrics.progress}
                    className={`h-1.5 md:h-2 ${isCompleted ? "[&>div]:bg-emerald-500" : ""
                      }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </section>
  );
}
