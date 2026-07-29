"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Task } from "@/types/task";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TaskCompletionChartProps {
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  className?: string;
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toDateString(),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold mb-1.5 text-foreground">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-0.5">
            <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface StatPillProps {
  label: string;
  value: number;
  color: string;
}

function StatPill({ label, value, color }: StatPillProps) {
  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", color)}>
      <span className="text-sm font-bold">{value}</span>
      <span className="opacity-75">{label}</span>
    </div>
  );
}

export function TaskCompletionChart({
  tasks,
  totalTasks,
  completedTasks,
  inProgressTasks,
  overdueTasks,
  className,
}: TaskCompletionChartProps) {
  const data = useMemo(() => {
    const days = getLast7Days();
    return days.map(({ date, label }) => {
      const dayTasks = tasks.filter((t) => {
        const taskDate = new Date(t.createdAt);
        return taskDate.toDateString() === date;
      });
      return {
        day: label,
        todo: dayTasks.filter((t) => t.status === "todo").length,
        "in-progress": dayTasks.filter((t) => t.status === "in-progress").length,
        done: dayTasks.filter((t) => t.status === "done").length,
      };
    });
  }, [tasks]);

  return (
    <Card className={cn("border-0 shadow-none bg-card flex flex-col p-0 gap-0 h-full overflow-hidden", className)}>
      <CardHeader className="px-3 pt-3 pb-2 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm md:text-base flex items-center gap-2">
            Task Activity
            <span className="text-xs font-normal text-muted-foreground">last 7 days</span>
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <StatPill label="Total" value={totalTasks} color="bg-slate-100 dark:bg-slate-800 text-foreground" />
          <StatPill label="Done" value={completedTasks} color="bg-primary/10 text-primary" />
          <StatPill label="Active" value={inProgressTasks} color="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" />
          {overdueTasks > 0 && (
            <StatPill label="Overdue" value={overdueTasks} color="bg-rose-500/10 text-rose-600 dark:text-rose-400" />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-2 pt-0 min-h-0">
        <div className="h-full min-h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={10} barGap={2}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "currentColor" }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "currentColor" }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
                width={18}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Bar dataKey="todo" name="todo" fill="#fbbf24" radius={[3, 3, 0, 0]} />
              <Bar dataKey="in-progress" name="in-progress" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="done" name="done" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
