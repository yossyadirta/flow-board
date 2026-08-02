import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SearchIcon,
  PlusIcon,
  Clock,
  MoreHorizontal,
  TextAlignStart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Section } from "./Section";
import {
  DEMO_TASKS,
  VIEW_TABS,
  type ViewKey,
  getStatusConfig,
  getStatusLabel,
} from "./constants";

const viewDescriptions: Record<ViewKey, { title: string; desc: string }> = {
  kanban: {
    title: "Kanban Board",
    desc: "Visual workflow management with drag-and-drop columns. See task progression at a glance.",
  },
  list: {
    title: "List View",
    desc: "A structured vertical layout grouped by status. Scan tasks quickly with accordion precision.",
  },
  table: {
    title: "Table View",
    desc: "A dense data grid powered by TanStack Table. Sort, scan, and manage tasks with spreadsheet efficiency.",
  },
  calendar: {
    title: "Calendar View",
    desc: "Tasks mapped to due dates in a monthly calendar. Never miss a deadline again.",
  },
};

export const DemoSection = () => {
  const [view, setView] = useState<ViewKey>("kanban");
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const handleSetView = (newView: ViewKey) => {
    if (newView === view) return;
    setIsLoading(true);
    setTimeout(() => {
      setView(newView);
      setIsLoading(false);
    }, 350);
  };

  const grouped = {
    todo: DEMO_TASKS.filter((t) => t.status === "todo"),
    "in-progress": DEMO_TASKS.filter((t) => t.status === "in-progress"),
    done: DEMO_TASKS.filter((t) => t.status === "done"),
  };

  return (
    <Section id="views" className="relative">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
            One data source.{" "}
            <span className="text-primary">Four perspectives.</span>
          </h2>
          <p className="mx-auto max-w-lg px-4 text-sm text-muted-foreground">
            Toggle between Kanban, List, Table, and Calendar views — all powered
            by the same data with seamless transitions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <div className="inline-flex rounded-lg border border-border/40 bg-muted/20 p-1 w-max">
            {VIEW_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = view === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleSetView(tab.key)}
                  className={`relative flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer ${isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="demo-tab-bg"
                      className="absolute inset-0 rounded-md border border-border/40 bg-card shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 size-4 ${isActive ? "text-primary" : ""
                      }`}
                  />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={view}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground max-w-xs text-center sm:text-left"
            >
              {viewDescriptions[view].desc}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full max-w-full rounded-xl pb-4 sm:pb-0"
        >
          <div className="w-full">
            <div className="rounded-xl border border-border/40 bg-card/80 p-1 shadow-2xl shadow-black/[0.08] dark:shadow-black/40 backdrop-blur-xl">
              <div className="rounded-lg border border-border/20 bg-card p-4">
                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-border/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚀</span>
                    <span className="text-sm font-semibold">
                      Product Launch
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {DEMO_TASKS.length} tasks
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex h-8 flex-1 sm:w-40 sm:flex-none items-center rounded-md border border-border/40 bg-background/60 px-2.5">
                      <SearchIcon className="size-3.5 text-muted-foreground mr-1.5 shrink-0" />
                      <span className="text-[11px] text-muted-foreground">
                        Search...
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {["All", "Today", "Overdue"].map((f) => (
                        <span
                          key={f}
                          className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium ${f === "All"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border/40 text-muted-foreground"
                            }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-[360px] flex items-center justify-center"
                    >
                      <div className="w-full h-full flex flex-col gap-4">
                        <div className="flex gap-4">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-4 flex-1 bg-muted/40 rounded animate-pulse"
                            />
                          ))}
                        </div>
                        <div className="flex gap-4 flex-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex-1 bg-muted/20 rounded-xl animate-pulse"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={view}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[360px]"
                    >
                      {view === "kanban" && (
                        <KanbanDemo grouped={grouped} />
                      )}
                      {view === "list" && <ListDemo grouped={grouped} />}
                      {view === "table" && <TableDemo />}
                      {view === "calendar" && <CalendarDemo />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

function KanbanDemo({
  grouped,
}: {
  grouped: Record<string, (typeof DEMO_TASKS)[number][]>;
}) {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 pb-2 sm:pb-0 sm:h-[360px]">
      {(
        [
          { status: "todo", label: "To Do" },
          { status: "in-progress", label: "In Progress" },
          { status: "done", label: "Done" },
        ] as const
      ).map((col) => {
        const tasks = grouped[col.status];
        return (
          <Card
            key={col.status}
            className="border border-border/40 bg-secondary/30 p-2.5 flex flex-col gap-2.5 min-w-[260px] sm:min-w-0"
          >
            <div className="flex items-center justify-between px-1.5 py-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background/50 text-[10px] font-medium text-muted-foreground border">
                  {tasks.length}
                </span>
              </div>
              <button className="p-1 hover:bg-background/50 rounded-md text-muted-foreground transition-colors cursor-pointer">
                <PlusIcon className="size-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                >
                  <Card className="group relative cursor-pointer border-0 bg-card text-card-foreground rounded-xl shadow-sm transition-all hover:shadow-md overflow-hidden py-0 gap-0 ring-1 ring-border/20">
                    <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-1.5 bg-background/80 backdrop-blur-md rounded-md border shadow-sm text-muted-foreground hover:text-foreground hover:bg-background">
                        <MoreHorizontal className="size-3" />
                      </div>
                    </div>

                    {task.cover && (
                      <div className="w-full relative">
                        <div
                          className="w-full h-2"
                          style={{ backgroundColor: task.cover.value }}
                        />
                      </div>
                    )}

                    <div className="p-4 pt-3 flex flex-col gap-2.5">
                      <div className="p-0 gap-0 pr-6">
                        <h3 className="flex-1 min-w-0 font-medium text-sm leading-tight text-left">
                          {task.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          {(task.description || task.dueDate) && (
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              {task.dueDate && (
                                <span className="flex flex-row gap-1 items-center bg-muted/40 px-1.5 py-0.5 rounded-md border border-border/40">
                                  <Clock className="h-3 w-3" />
                                  {task.dueDate}
                                </span>
                              )}
                              {task.description && <TextAlignStart className="h-3 w-3" />}
                            </div>
                          )}
                        </div>

                        {task.assignee && (
                          <Avatar className="w-5 h-5 border border-background shadow-sm ml-2 shrink-0">
                            <AvatarFallback
                              className="text-white text-[8px]"
                              style={{ backgroundColor: task.assignee.bg_color }}
                            >
                              {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-lg transition-colors border border-transparent hover:border-border/40 cursor-pointer">
              <PlusIcon className="size-3.5" />
              Add New Task
            </button>
          </Card>
        );
      })}
    </div>
  );
}

function ListDemo({
  grouped,
}: {
  grouped: Record<string, (typeof DEMO_TASKS)[number][]>;
}) {
  return (
    <div className="space-y-4">
      {(
        [
          { status: "todo", label: "To Do" },
          { status: "in-progress", label: "In Progress" },
          { status: "done", label: "Done" },
        ] as const
      ).map((col) => {
        const tasks = grouped[col.status];
        if (tasks.length === 0) return null;
        const config = getStatusConfig(col.status);
        return (
          <div key={col.status}>
            <div
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${config.bg} ${config.border} border shadow-sm mb-2`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${config.dot}`}
                />
                <span className={`text-sm font-bold ${config.color}`}>
                  {col.label}
                  <span className="ml-1 opacity-50 font-medium text-xs">
                    ({tasks.length})
                  </span>
                </span>
              </div>
            </div>
            <div className="ml-6 border-l-2 border-muted/30 pl-4 space-y-2">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  className="group flex items-center justify-between p-3.5 rounded-xl border bg-card shadow-sm hover:shadow-md cursor-pointer transition-all"
                  style={
                    task.cover
                      ? {
                        borderLeftWidth: 4,
                        borderLeftColor: task.cover.value,
                      }
                      : {}
                  }
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground/60 w-10">
                      {task.key}
                    </span>
                    <span className="text-sm font-medium">{task.title}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/40">
                        <Clock className="mr-1.5 size-3.5" />
                        {task.dueDate}
                      </div>
                    )}
                    {task.assignee && (
                      <Avatar className="w-6 h-6 border border-background shadow-sm">
                        <AvatarFallback
                          className="text-white text-[10px]"
                          style={{ backgroundColor: task.assignee.bg_color }}
                        >
                          {task.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TableDemo() {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 border-b border-border/40">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              ID
            </th>
            <th className="px-5 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Task
            </th>
            <th className="px-5 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Assignee
            </th>
            <th className="px-5 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {DEMO_TASKS.map((task, i) => {
            const config = getStatusConfig(task.status);
            return (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
                className="hover:bg-muted/20 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-3.5 font-mono text-muted-foreground/70 text-xs font-medium">
                  {task.key}
                </td>
                <td className="px-5 py-3.5 font-medium">{task.title}</td>
                <td className="px-5 py-3.5">
                  <Badge
                    className={`font-medium text-[10px] border-transparent ${config.badgeClass} shadow-none`}
                  >
                    {getStatusLabel(task.status)}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5 border border-background">
                        <AvatarFallback
                          className="text-white text-[8px]"
                          style={{ backgroundColor: task.assignee.bg_color }}
                        >
                          {task.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">-</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">
                  {task.dueDate || "-"}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- Calendar Demo (Refined) ---
function CalendarDemo() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    if (i < 0) return null;
    const day = i + 1;
    return day <= 30 ? day : null;
  });

  const taskMap: Record<number, (typeof DEMO_TASKS)[number][]> = {
    3: [DEMO_TASKS[0]],
    5: [DEMO_TASKS[1]],
    8: [DEMO_TASKS[2]],
    10: [DEMO_TASKS[3]],
    12: [DEMO_TASKS[4]],
    15: [DEMO_TASKS[5]],
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">June 2026</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 text-xs rounded-md bg-secondary text-muted-foreground font-medium border border-border/40 shadow-sm">
            Today
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 border rounded-xl overflow-hidden shadow-sm">
        {days.map((d) => (
          <div
            key={d}
            className="text-[11px] font-semibold text-muted-foreground text-center py-2.5 bg-muted/40 border-b border-border/60"
          >
            {d}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          if (day === null) {
            return (
              <div
                key={`empty-${i}`}
                className="min-h-[70px] border-r border-b border-border/20 bg-muted/10"
              />
            );
          }
          const tasks = taskMap[day];
          const isToday = day === 10;
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01 }}
              className={`min-h-[70px] p-1.5 border-r border-b border-border/20 transition-colors hover:bg-muted/30 cursor-pointer ${isToday ? "bg-primary/5" : ""
                }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground"
                    }`}
                >
                  {day}
                </span>
                {tasks && tasks.length > 0 && (
                  <span className="text-[9px] text-muted-foreground/60 font-medium">
                    {tasks.length}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                {tasks?.map((task) => {
                  const config = getStatusConfig(task.status);
                  return (
                    <div
                      key={task.id}
                      className={`text-[9px] px-1.5 py-1 rounded truncate font-medium ${config.bg} ${config.color} border border-transparent hover:border-current/20 transition-colors`}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
