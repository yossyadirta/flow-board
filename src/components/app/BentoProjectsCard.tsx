"use client";

import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BOARD_ICONS_MAP, BoardIconId } from "@/components/app/board/BoardIcons";
import { Board } from "@/types/board";
import { cn } from "@/lib/utils";

interface BentoProjectsCardProps {
  boards: Board[];
  getBoardMetrics: (id: string) => { progress: number; done: number; remaining: number };
  className?: string;
}

export function BentoProjectsCard({ boards, getBoardMetrics, className }: BentoProjectsCardProps) {
  const router = useRouter();

  return (
    <Card className={cn("bg-card/80 backdrop-blur-xl border border-border/40 shadow-sm ring-1 ring-white/5 flex flex-col p-0 gap-0 h-full overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="shrink-0 px-3 pt-3 pb-2">
        <CardTitle className="text-sm md:text-base flex items-center gap-2">
          All Boards
          <span className="text-xs font-normal text-muted-foreground">{boards.length} boards</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col divide-y divide-border/50 pb-2">
            {boards.map((board) => {
              const metrics = getBoardMetrics(board.id);
              const emoji = BOARD_ICONS_MAP[board.icon as BoardIconId]?.emoji || "📋";
              const isCompleted = metrics.progress === 100 && metrics.done > 0;

              return (
                <button
                  key={board.id}
                  onClick={() => router.push(`/app/board/${board.key || board.id}`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent/60 transition-colors text-left group"
                >
                  <span className="text-lg shrink-0">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs md:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {board.name}
                      </span>
                      <span className={cn(
                        "text-[10px] font-semibold ml-2 shrink-0",
                        isCompleted ? "text-primary" : metrics.progress > 0 ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {metrics.progress}%
                      </span>
                    </div>
                    <Progress
                      value={metrics.progress}
                      className={cn("h-1", isCompleted ? "[&>div]:bg-primary" : "")}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
