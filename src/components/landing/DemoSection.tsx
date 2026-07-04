import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Database,
  SquareKanban,
  List,
  Table2,
  SearchIcon,
  PlusIcon,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "./Section";
import { StatusIcon } from "./StatusIcon";
import { DEMO_TASKS, getStatusConfig, getStatusLabel } from "./constants";

export const DemoSection = () => {
  const [view, setView] = useState<"kanban" | "list" | "table">("kanban");
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSetView = (newView: "kanban" | "list" | "table") => {
    if (newView === view) return;
    setIsDemoLoading(true);
    setTimeout(() => {
      setView(newView);
      setIsDemoLoading(false);
    }, 500);
  };
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const grouped = {
    todo: DEMO_TASKS.filter((t) => t.status === "todo"),
    "in-progress": DEMO_TASKS.filter((t) => t.status === "in-progress"),
    done: DEMO_TASKS.filter((t) => t.status === "done"),
  };

  return (
    <Section id="demo" className="relative">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
            One Data Store.{" "}
            <span className="text-primary">
              Multi-Dimensional Views.
            </span>
          </h2>
          <p className="mx-auto max-w-xl px-4 text-sm sm:text-base text-muted-foreground">
            Toggle between Kanban, List, and Table views. All powered by the
            same data source with seamless transitions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex items-center justify-center overflow-x-auto px-4"
        >
          <div className="inline-flex rounded-lg border border-border/50 bg-muted/30 p-1 w-max">
            {(
              [
                { key: "kanban", icon: SquareKanban, label: "Kanban" },
                { key: "list", icon: List, label: "List" },
                { key: "table", icon: Table2, label: "Table" },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = view === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleSetView(tab.key)}
                  className={`relative flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                    ? "text-foreground cursor-default"
                    : "text-muted-foreground hover:text-foreground cursor-pointer"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="demo-tab-indicator"
                      className="absolute inset-0 rounded-md border border-border/50 bg-card shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 size-4 ${isActive ? "text-primary" : ""}`}
                  />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="max-w-[90vw] sm:max-w-full overflow-x-auto rounded-xl pb-4 sm:pb-0">
          <div className="min-w-[600px] sm:min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl border border-border/50 bg-card/80 p-1 shadow-xl"
            >
              <div className="rounded-lg border border-border/30 bg-card p-4">
                <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between border-b border-border/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚀</span>
                    <span className="text-sm font-semibold">Product Launch</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {DEMO_TASKS.length} tasks
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="flex h-8 flex-1 sm:w-40 sm:flex-none items-center rounded-md border border-border/50 bg-background/60 px-2.5">
                      <SearchIcon className="size-3.5 text-muted-foreground mr-1.5 shrink-0" />
                      <span className="text-[11px] text-muted-foreground truncate">
                        Search...
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["All", "Today", "Overdue"].map((f) => (
                        <span
                          key={f}
                          className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium ${f === "All"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border/50 text-muted-foreground"
                            }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isDemoLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-96 flex items-center justify-center p-4"
                    >
                      <div className="w-full h-full flex flex-col gap-4 animate-in fade-in duration-300">
                        <div className="flex gap-4">
                          <div className="h-4 w-1/4 bg-muted/50 rounded animate-pulse" />
                          <div className="h-4 w-1/4 bg-muted/50 rounded animate-pulse" />
                          <div className="h-4 w-1/4 bg-muted/50 rounded animate-pulse" />
                        </div>
                        <div className="flex gap-4 flex-1">
                          <div className="flex-1 bg-muted/30 rounded-lg animate-pulse" />
                          <div className="flex-1 bg-muted/30 rounded-lg animate-pulse" />
                          <div className="flex-1 bg-muted/30 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    </motion.div>
                  ) : view === "kanban" ? (
                    <motion.div
                      key="kanban"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto pb-2 sm:pb-0"
                    >
                      {(
                        [
                          { status: "todo", label: "To do" },
                          { status: "in-progress", label: "Doing" },
                          { status: "done", label: "Done" },
                        ] as const
                      ).map((col) => {
                        const tasks = grouped[col.status];
                        return (
                          <Card
                            key={col.status}
                            className="border-0 bg-secondary p-3 flex flex-col gap-2 min-w-[240px] sm:min-w-0"
                          >
                            <div className="flex items-center justify-between py-1">
                              <span className="text-xs font-medium">
                                {col.label}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] text-muted-foreground">
                                {tasks.length}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {tasks.map((task) => (
                                <Card
                                  key={task.id}
                                  className="border-0 bg-card shadow-sm rounded-xl py-0 gap-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                >
                                  {task.cover && (
                                    <div
                                      className="w-full h-3.5"
                                      style={{
                                        backgroundColor: task.cover.value,
                                      }}
                                    />
                                  )}
                                  <div className="p-3 pt-2.5">
                                    <div className="text-xs font-medium leading-tight">
                                      {task.title}
                                    </div>
                                    {task.dueDate && (
                                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1.5">
                                        <Clock className="size-3" />
                                        {task.dueDate}
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 px-1 pt-1 mt-auto">
                              <PlusIcon className="size-3" />
                              Add New Task
                            </div>
                          </Card>
                        );
                      })}
                    </motion.div>
                  ) : view === "list" ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {(
                        [
                          { status: "todo", label: "To do" },
                          { status: "in-progress", label: "Doing" },
                          { status: "done", label: "Done" },
                        ] as const
                      ).map((col) => {
                        const tasks = grouped[col.status];
                        if (tasks.length === 0) return null;
                        const config = getStatusConfig(col.status);
                        return (
                          <div key={col.status}>
                            <div
                              className={`flex items-center justify-between py-1.5 px-3 rounded-lg ${config.bg} ${config.border} border shadow-sm mb-2`}
                            >
                              <div className="flex items-center gap-2">
                                <StatusIcon status={col.status} />
                                <span
                                  className={`text-xs font-bold tracking-tight ${config.color}`}
                                >
                                  {col.label}
                                  <span className="ml-1 opacity-50 font-medium">
                                    ({tasks.length})
                                  </span>
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                + Add Task
                              </span>
                            </div>
                            <div className="ml-7 border-l-2 border-muted/30 pl-4 space-y-2">
                              {tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="group flex items-center justify-between p-3 rounded-xl border bg-card shadow-sm cursor-pointer hover:bg-accent/5 transition-all"
                                  style={
                                    task.cover
                                      ? {
                                        borderLeftWidth: 4,
                                        borderLeftColor: task.cover.value,
                                      }
                                      : {}
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] font-bold text-muted-foreground/60 tracking-tighter">
                                      {task.key}
                                    </span>
                                    <span className="text-xs font-medium text-foreground/90">
                                      {task.title}
                                    </span>
                                  </div>
                                  {task.dueDate && (
                                    <div className="flex items-center text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border">
                                      <Clock className="mr-1 size-3" />
                                      {task.dueDate}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  ) : view === "table" ? (
                    <motion.div
                      key="table"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-x-auto rounded-md border"
                    >
                      <table className="w-full text-xs">
                        <thead className="bg-muted/50">
                          <tr className="border-b">
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                              ID
                            </th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                              Task
                            </th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                              Status
                            </th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                              Due Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {DEMO_TASKS.map((task) => {
                            const config = getStatusConfig(task.status);
                            return (
                              <tr
                                key={task.id}
                                className="border-b border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
                              >
                                <td className="px-4 py-2.5 font-mono text-muted-foreground">
                                  {task.key}
                                </td>
                                <td className="px-4 py-2.5 font-medium">
                                  {task.title}
                                </td>
                                <td className="px-4 py-2.5">
                                  <Badge
                                    className={`font-medium text-[10px] border-transparent ${config.badgeClass}`}
                                  >
                                    {getStatusLabel(task.status)}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground">
                                  {task.dueDate || "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
};
