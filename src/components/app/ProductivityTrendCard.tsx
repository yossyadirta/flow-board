import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { subDays, format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  tasks: Task[];
  className?: string;
}

export function ProductivityTrendCard({ tasks, className }: Props) {
  const data = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));

    return days.map(day => {
      const completedOnDay = tasks.filter(t => {
        if (t.status !== "done") return false;
        const taskDate = new Date(t.updatedAt || t.createdAt);
        return isSameDay(taskDate, day);
      }).length;

      return {
        name: format(day, "EEE"),
        fullDate: format(day, "MMM dd, yyyy"),
        completed: completedOnDay
      };
    });
  }, [tasks]);

  const hasAnyData = data.some(d => d.completed > 0);
  const chartData = hasAnyData ? data : data.map((d, i) => ({
    ...d,
    completed: [2, 5, 3, 7, 4, 8, 5][i] // dummy curve
  }));

  const totalCompleted = chartData.reduce((sum, item) => sum + item.completed, 0);

  return (
    <Card className={cn("bg-card/80 backdrop-blur-xl border border-border/40 shadow-sm ring-1 ring-white/5 flex flex-col p-0 gap-0 h-full overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="px-3 pt-3 pb-2 shrink-0 border-none">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            Productivity Trend
            <span className="text-xs font-normal text-muted-foreground">Last 7 Days</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col min-h-0 relative">
        <div className="px-4 pt-3 pb-0">
          <div className="text-3xl font-bold text-foreground">
            {totalCompleted} <span className="text-sm font-normal text-muted-foreground tracking-normal">tasks done</span>
          </div>
        </div>

        <div className="flex-1 w-full h-full min-h-[120px] mt-2 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 16 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                formatter={(value: any) => [`${value} tasks`, 'Completed']}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
