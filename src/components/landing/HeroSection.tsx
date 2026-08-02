import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import {
  ArrowRight,
  Clock,
  PlusIcon,
  SearchIcon,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HERO_HEADLINE,
  HERO_SUBTITLE,
  DEMO_TASKS,
  VIEW_TABS,
  type ViewKey,
  fadeUp,
  getStatusConfig,
  getStatusLabel,
} from "./constants";
import { InteractiveDotGrid } from "./InteractiveDotGrid";
import { Section } from "./Section";

const VIEW_CYCLE_MS = 4000;

interface HeroSectionProps {
  onLaunchApp?: (e: React.MouseEvent) => void;
}

// --- Mini Kanban View ---
const MiniKanban = () => {
  const columns = [
    { status: "todo" as const, label: "To Do" },
    { status: "in-progress" as const, label: "In Progress" },
    { status: "done" as const, label: "Done" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 h-full">
      {columns.map((col) => {
        const tasks = DEMO_TASKS.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            className="rounded-lg bg-secondary/80 p-2 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-0.5 mb-1.5">
              <span className="text-[10px] font-semibold">{col.label}</span>
              <span className="text-[9px] text-muted-foreground">
                {tasks.length}
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className="border-0 bg-card shadow-sm rounded-md py-0 gap-0 overflow-hidden"
                >
                  {task.cover && (
                    <div
                      className="w-full h-1.5"
                      style={{ backgroundColor: task.cover.value }}
                    />
                  )}
                  <div className="p-2 pt-1.5">
                    <CardHeader className="p-0 gap-0">
                      <CardTitle className="text-[10px] font-medium leading-tight truncate text-start">
                        {task.title}
                      </CardTitle>
                    </CardHeader>
                    {task.dueDate && (
                      <p className="text-[8px] text-muted-foreground flex items-center gap-0.5 mt-1">
                        <Clock className="size-2" />
                        {task.dueDate}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
              <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground/50 px-0.5 mt-auto pt-0.5">
                <PlusIcon className="size-2.5" />
                Add Task
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Mini List View ---
const MiniList = () => {
  const groups = [
    { status: "todo" as const, label: "To Do" },
    { status: "in-progress" as const, label: "In Progress" },
    { status: "done" as const, label: "Done" },
  ];

  return (
    <div className="space-y-2.5 h-full overflow-hidden">
      {groups.map((group) => {
        const tasks = DEMO_TASKS.filter((t) => t.status === group.status);
        const config = getStatusConfig(group.status);
        if (tasks.length === 0) return null;
        return (
          <div key={group.status}>
            <div
              className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${config.bg} ${config.border} border shadow-sm mb-1`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
              />
              <span className={`text-[10px] font-bold ${config.color}`}>
                {group.label}
                <span className="ml-1 opacity-50 font-medium">
                  ({tasks.length})
                </span>
              </span>
            </div>
            <div className="ml-4 border-l-2 border-muted/30 pl-3 space-y-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-md border bg-card shadow-sm"
                  style={
                    task.cover
                      ? { borderLeftWidth: 3, borderLeftColor: task.cover.value }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] font-bold text-muted-foreground/60">
                      {task.key}
                    </span>
                    <span className="text-[10px] font-medium">
                      {task.title}
                    </span>
                  </div>
                  {task.dueDate && (
                    <span className="text-[8px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded-full border">
                      {task.dueDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Mini Table View ---
const MiniTable = () => (
  <div className="overflow-hidden rounded-md border h-full">
    <table className="w-full text-[10px]">
      <thead className="bg-muted/50">
        <tr className="border-b">
          <th className="px-2.5 py-1.5 text-left font-medium text-muted-foreground">
            ID
          </th>
          <th className="px-2.5 py-1.5 text-left font-medium text-muted-foreground">
            Task
          </th>
          <th className="px-2.5 py-1.5 text-left font-medium text-muted-foreground">
            Status
          </th>
          <th className="px-2.5 py-1.5 text-left font-medium text-muted-foreground">
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
              className="border-b border-border/30 hover:bg-muted/30 transition-colors"
            >
              <td className="px-2.5 py-1.5 font-mono text-muted-foreground">
                {task.key}
              </td>
              <td className="px-2.5 py-1.5 font-medium">{task.title}</td>
              <td className="px-2.5 py-1.5">
                <Badge
                  className={`font-medium text-[8px] border-transparent ${config.badgeClass} px-1.5 py-0`}
                >
                  {getStatusLabel(task.status)}
                </Badge>
              </td>
              <td className="px-2.5 py-1.5 text-muted-foreground">
                {task.dueDate || "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// --- Mini Calendar View ---
const MiniCalendar = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = Array.from({ length: 28 }, (_, i) => i + 1);

  const taskDayMap: Record<number, (typeof DEMO_TASKS)[number][]> = {
    3: [DEMO_TASKS[0]],
    5: [DEMO_TASKS[1]],
    8: [DEMO_TASKS[2]],
    10: [DEMO_TASKS[3]],
    12: [DEMO_TASKS[4]],
    15: [DEMO_TASKS[5]],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold">June 2026</span>
        <div className="flex gap-1">
          <div className="px-2 py-0.5 rounded text-[9px] bg-secondary text-muted-foreground">
            Today
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {days.map((d) => (
          <div
            key={d}
            className="text-[8px] font-semibold text-muted-foreground text-center py-1"
          >
            {d}
          </div>
        ))}
        {calendarDays.map((day) => {
          const tasks = taskDayMap[day];
          const isToday = day === 10;
          return (
            <div
              key={day}
              className={`p-0.5 min-h-[28px] border-t border-border/20 ${isToday ? "bg-primary/5" : ""
                }`}
            >
              <span
                className={`text-[8px] flex items-center justify-center w-4 h-4 rounded-full ${isToday
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground"
                  }`}
              >
                {day}
              </span>
              {tasks?.map((task) => {
                const config = getStatusConfig(task.status);
                return (
                  <div
                    key={task.id}
                    className={`mt-0.5 text-[6px] px-1 py-0.5 rounded truncate font-medium ${config.bg} ${config.color}`}
                  >
                    {task.title.split(" ").slice(0, 2).join(" ")}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const viewComponents: Record<ViewKey, React.ReactNode> = {
  kanban: <MiniKanban />,
  list: <MiniList />,
  table: <MiniTable />,
  calendar: <MiniCalendar />,
};

const viewTransition = {
  initial: { opacity: 0, y: 8, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(2px)" },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
};

export const HeroSection = ({ onLaunchApp }: HeroSectionProps) => {
  const [activeView, setActiveView] = useState<ViewKey>("kanban");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveView((prev) => {
        const keys: ViewKey[] = ["kanban", "list", "table", "calendar"];
        const idx = keys.indexOf(prev);
        return keys[(idx + 1) % keys.length];
      });
    }, VIEW_CYCLE_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleViewClick = useCallback(
    (view: ViewKey) => {
      setActiveView(view);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), VIEW_CYCLE_MS * 2);
    },
    []
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 150, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-400, 400], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-400, 400], [-5, 5]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Ensure window is defined (SSR safe)
    if (typeof window !== "undefined") {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    }
  }, [mouseX, mouseY]);

  const headlineWords = HERO_HEADLINE.split(/(\s+|\n)/).filter(Boolean);

  return (
    <Section
      className="relative min-h-screen pt-28 pb-8 overflow-hidden perspective-[2000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      <InteractiveDotGrid />
      {/* Interactive Spotlight */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-primary/20 rounded-full blur-[100px] sm:blur-[120px] z-0 opacity-40 mix-blend-screen"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
        }}
      />

      {/* Gradient orb backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Headline */}
        <h1 className="mt-8 mb-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-0 text-4xl leading-[1.1] font-semibold tracking-tighter md:text-6xl lg:text-7xl">
          {headlineWords.map((word, i) =>
            word === "\n" ? (
              <span key={`br-${i}`} className="basis-full h-0" />
            ) : (
              <motion.span
                key={`${word}-${i}`}
                custom={i}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
                  visible: (idx: number) => ({
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      delay: idx * 0.06,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  }),
                }}
                initial="hidden"
                animate="visible"
                className={
                  word === "flow."
                    ? "text-primary"
                    : ""
                }
              >
                {word}
              </motion.span>
            )
          )}
        </h1>

        {/* Subtitle */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8 max-w-xl px-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]"
        >
          {HERO_SUBTITLE}
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3"
        >
          <Button
            size="lg"
            className="gap-2 px-6 sm:px-8 text-xs sm:text-sm shadow-lg shadow-primary/20 cursor-pointer"
            onClick={onLaunchApp}
          >
            Start Building
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 px-5 sm:px-6 text-xs sm:text-sm cursor-pointer"
            asChild
          >
            <a href="#views">
              <Play className="size-3.5" />
              See it in action
            </a>
          </Button>
        </motion.div>

        {/* Morphing App Mockup */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative mt-14 sm:mt-16 w-full max-w-4xl perspective-[2000px]"
        >
          <motion.div
            style={{ rotateX, rotateY }}
            className="rounded-xl border border-border/40 bg-card/60 p-1 shadow-2xl shadow-black/[0.08] dark:shadow-black/30"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="rounded-lg border border-border/20 bg-card overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border/20 bg-muted/20 px-3.5 py-2">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-red-400/50" />
                  <div className="size-2 rounded-full bg-amber-400/50" />
                  <div className="size-2 rounded-full bg-emerald-400/50" />
                </div>
                <div className="ml-2 flex h-5 w-40 sm:w-56 items-center rounded-md bg-background/60 px-2.5">
                  <span className="text-[9px] text-muted-foreground">
                    flowboard.app
                  </span>
                </div>
              </div>

              {/* Board header inside mockup */}
              <div className="bg-background px-4 pt-3 pb-0">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🚀</span>
                    <span className="text-xs font-bold">Product Launch</span>
                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                      {DEMO_TASKS.length} tasks
                    </Badge>
                  </div>
                  <div className="flex h-6 w-28 items-center rounded-md border border-border/40 bg-secondary/30 px-2">
                    <SearchIcon className="size-2.5 text-muted-foreground mr-1" />
                    <span className="text-[9px] text-muted-foreground">
                      Search...
                    </span>
                  </div>
                </div>

                {/* View tabs */}
                <div className="flex items-center gap-0.5 border-b border-border/20 -mx-4 px-4">
                  {VIEW_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeView === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => handleViewClick(tab.key)}
                        className={`relative flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium transition-colors cursor-pointer ${isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <Icon
                          className={`size-3 ${isActive ? "text-primary" : ""}`}
                        />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="hero-view-tab"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}

                  {/* Auto-cycle progress indicator */}
                  <div className="ml-auto flex items-center gap-1">
                    {VIEW_TABS.map((tab) => (
                      <div
                        key={tab.key}
                        className={`w-1 h-1 rounded-full transition-colors duration-300 ${activeView === tab.key
                            ? "bg-primary"
                            : "bg-muted-foreground/20"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* View content area */}
              <div className="p-3 bg-background" style={{ minHeight: 280 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    {...viewTransition}
                    className="h-full"
                    style={{ minHeight: 260 }}
                  >
                    {viewComponents[activeView]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Spotlight overlay */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(var(--primary-rgb), 0.15), transparent 80%)`,
            }}
          />

          {/* Glow effect behind mockup */}
          <div className="absolute -inset-4 bg-primary/[0.03] rounded-2xl blur-2xl -z-10 pointer-events-none" />
        </motion.div>
      </div>
    </Section>
  );
};
