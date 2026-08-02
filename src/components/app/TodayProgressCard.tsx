import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  tasks: Task[];
  className?: string;
}

export function TodayProgressCard({ tasks, className }: Props) {
  const { totalToday, completedToday, pct } = useMemo(() => {
    let total = 0;
    let completed = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(t => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate);
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === today.getTime()) {
        total++;
        if (t.status === "done") {
          completed++;
        }
      }
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { totalToday: total, completedToday: completed, pct: percentage };
  }, [tasks]);

  const isClearDay = totalToday === 0;
  const isAllDone = totalToday > 0 && totalToday === completedToday;

  const data = [
    { value: isClearDay ? 100 : pct },
    { value: isClearDay ? 0 : Math.max(100 - pct, 0) },
  ];

  let mainColor = "#8b5cf6";
  if (isClearDay) mainColor = "hsl(var(--muted-foreground) / 0.3)";
  else if (isAllDone) mainColor = "#10b981";
  return (
    <Card className={cn(
      "bg-card/80 backdrop-blur-xl border border-border/40 shadow-sm ring-1 ring-white/5 flex flex-col p-0 gap-0 h-full overflow-hidden transition-all hover:shadow-md",
      isAllDone ? "bg-emerald-500/5" : "",
      className
    )}>
      <div
        className="absolute inset-0 opacity-[0.03] transition-all pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at center, ${mainColor} 0%, transparent 70%)` }}
      />

      <CardHeader className="px-3 pt-3 pb-2 shrink-0 border-none relative z-10">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            Today's Goal
            <span className="text-xs font-normal text-muted-foreground">Today</span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 gap-3 relative z-10 w-full">
        <div className="relative w-20 h-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={38}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
                cornerRadius={12}
              >
                <Cell fill={mainColor} />
                <Cell fill="hsl(var(--secondary))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isClearDay ? (
              <span className="text-xl font-bold tracking-tight text-muted-foreground/50">
                -
              </span>
            ) : isAllDone ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            ) : (
              <span className="text-lg font-bold tracking-tight leading-none text-foreground">
                {pct}<span className="text-xs opacity-70">%</span>
              </span>
            )}
          </div>
        </div>

        <div className="w-full text-center">
          {isClearDay ? (
            <p className="text-xs text-muted-foreground font-medium">
              No tasks today
            </p>
          ) : isAllDone ? (
            <p className="text-xs text-emerald-500 font-bold">
              All done!
            </p>
          ) : (
            <p className="text-xs text-muted-foreground font-medium">
              <span className="text-foreground font-semibold">{completedToday}</span> of {totalToday} completed
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
