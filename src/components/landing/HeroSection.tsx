import React, { useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  Clipboard,
  SearchIcon,
  Star,
  SquareKanban,
  List,
  Table2,
  PlusIcon,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HERO_WORDS, DEMO_TASKS, wordVariants, fadeUp } from "./constants";
import { Section } from "./Section";

const GRID_GAP = 40;
const DOT_RADIUS = 1.5;
const COLS = 42;
const ROWS = 24;
const INFLUENCE_RADIUS = 120;

const ParticleField = ({
  cursorX,
  cursorY,
  elWidth,
  elHeight,
}: {
  cursorX: ReturnType<typeof useMotionValue<number>>;
  cursorY: ReturnType<typeof useMotionValue<number>>;
  elWidth: number;
  elHeight: number;
}) => {
  const dots = useMemo(() => {
    const result: { cx: number; cy: number; idx: number }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        result.push({
          cx: col * GRID_GAP + GRID_GAP / 2,
          cy: row * GRID_GAP + GRID_GAP / 2,
          idx: row * COLS + col,
        });
      }
    }
    return result;
  }, []);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${COLS * GRID_GAP} ${ROWS * GRID_GAP}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {dots.map((dot) => (
        <Dot
          key={dot.idx}
          cx={dot.cx}
          cy={dot.cy}
          idx={dot.idx}
          cursorX={cursorX}
          cursorY={cursorY}
          elWidth={elWidth}
          elHeight={elHeight}
        />
      ))}
    </svg>
  );
};

const Dot = React.memo(
  ({
    cx,
    cy,
    idx,
    cursorX,
    cursorY,
    elWidth,
    elHeight,
  }: {
    cx: number;
    cy: number;
    idx: number;
    cursorX: ReturnType<typeof useMotionValue<number>>;
    cursorY: ReturnType<typeof useMotionValue<number>>;
    elWidth: number;
    elHeight: number;
  }) => {
    const svgWidth = COLS * GRID_GAP;
    const svgHeight = ROWS * GRID_GAP;

    const dist = useTransform(
      [cursorX, cursorY],
      ([mx, my]: number[]) => {
        if (mx < 0 && my < 0) return 999;
        const svgCursorX = (mx / (elWidth || svgWidth)) * svgWidth;
        const svgCursorY = (my / (elHeight || svgHeight)) * svgHeight;
        const dx = svgCursorX - cx;
        const dy = svgCursorY - cy;
        return Math.sqrt(dx * dx + dy * dy);
      }
    );

    const proximity = useTransform(dist, [0, INFLUENCE_RADIUS * 3], [1, 0]);
    const scale = useTransform(proximity, [0, 1], [1, 2.2]);
    const opacity = useTransform(proximity, [0, 1], [0.06, 0.35]);

    const breatheDelay = (idx % 7) * 0.8 + (idx % 3) * 1.2;

    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={DOT_RADIUS}
        className="fill-primary"
        style={{
          scale,
          opacity,
          transformOrigin: `${cx}px ${cy}px`,
        }}
        animate={{
          opacity: [0.04, 0.1, 0.04],
        }}
        transition={{
          duration: 4 + (idx % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: breatheDelay,
        }}
      />
    );
  }
);
Dot.displayName = "Dot";

const FloatingCard = ({
  children,
  className,
  floatY = [-6, 6],
  floatRotate = [0.5, -0.5],
  duration = 7,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  floatY?: [number, number];
  floatRotate?: [number, number];
  duration?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [floatY[0], floatY[1], floatY[0]],
        rotate: [floatRotate[0], floatRotate[1], floatRotate[0]],
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.8 + delay },
        scale: { duration: 0.5, delay: 0.8 + delay, type: "spring" },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay: 0.8 + delay },
        rotate: { duration, repeat: Infinity, ease: "easeInOut", delay: 0.8 + delay },
      }}
      whileHover={{
        scale: 1.05,
        y: floatY[0] - 8,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      className={`cursor-default rounded-lg border border-border/50 bg-card/80 p-3 shadow-xl transition-colors duration-300 hover:border-primary/50 hover:shadow-primary/10 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
};

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elSize, setElSize] = React.useState({ w: 0, h: 0 });
  const cursorX = useMotionValue(-1);
  const cursorY = useMotionValue(-1);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setElSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    obs.observe(el);
    setElSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    },
    [cursorX, cursorY]
  );

  const handleMouseLeave = useCallback(() => {
    cursorX.set(-1);
    cursorY.set(-1);
  }, [cursorX, cursorY]);

  return (
    <Section className="relative min-h-screen pt-32">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto absolute inset-0 overflow-hidden"
      >
        <ParticleField cursorX={cursorX} cursorY={cursorY} elWidth={elSize.w} elHeight={elSize.h} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="mt-12 mb-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
          {HERO_WORDS.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              custom={i}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className={word === "Flow," ? "text-primary" : ""}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10 max-w-2xl px-4 text-sm leading-relaxed text-muted-foreground md:text-lg"
        >
          A lightning-fast, sleek productivity board inspired by Linear. No
          heavy database setups—100% private and secured right in your Local
          Storage.
        </motion.p>

        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Button
            asChild
            size="lg"
            className="gap-2 px-6 sm:px-8 text-xs sm:text-sm shadow-lg shadow-primary/20"
          >
            <Link href="/app" target="_blank" rel="noopener noreferrer">
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="relative mt-16 sm:mt-20 w-[90vw] sm:w-full max-w-5xl overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
          <div className="min-w-[850px] lg:min-w-0">
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.02,
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="rounded-xl border border-border/50 bg-card/60 p-1 shadow-2xl shadow-black/10 transition-colors duration-300 hover:border-primary/50 hover:shadow-primary/10"
            >
              <div className="rounded-lg border border-border/30 bg-card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border/30 bg-muted/30 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-red-400/60" />
                    <div className="size-2.5 rounded-full bg-amber-400/60" />
                    <div className="size-2.5 rounded-full bg-emerald-400/60" />
                  </div>
                  <div className="ml-2 sm:ml-4 flex h-6 w-32 sm:w-64 items-center rounded-md bg-background/60 px-2 sm:px-3">
                    <span className="text-[10px] text-muted-foreground truncate">
                      flowboard.app/app
                    </span>
                  </div>
                </div>
                <div className="flex" style={{ height: 340 }}>
                  <div className="hidden w-72 shrink-0 bg-secondary/30 p-1.5 md:flex">
                    <div className="flex w-14 shrink-0 flex-col items-center gap-3 py-1.5 pr-1.5">
                      <div>
                        <Image
                          src="/logo.svg"
                          alt="Flowboard"
                          width={22}
                          height={22}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-2 mt-1">
                        <div className="p-2 rounded-lg hover:bg-accent flex flex-col align-middle justify-center text-[0.75rem] gap-1.5 font-medium items-center bg-background cursor-pointer">
                          <Clipboard className="size-4 text-foreground/70" />
                          Boards
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-3 overflow-hidden bg-background rounded-lg border border-border/30 shadow-sm">
                      <div className="flex h-8 items-center rounded-md bg-secondary/50 px-2.5 mb-3 border border-border/30">
                        <SearchIcon className="size-3.5 text-muted-foreground mr-2" />
                        <span className="text-[11px] text-muted-foreground">
                          Search boards...
                        </span>
                      </div>
                      <div className="text-[10px] text-start text-muted-foreground mb-2 px-1 font-medium">
                        + Add Board
                      </div>
                      <div className="text-[9px] text-start tracking-wider text-muted-foreground/60 mb-2 px-1 mt-3">
                        Favorites
                      </div>
                      {[
                        { emoji: "🚀", name: "Product Launch", active: true },
                        { emoji: "💡", name: "Ideas Backlog", active: false },
                      ].map((b) => (
                        <div
                          key={b.name}
                          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] mb-0.5 ${b.active
                            ? "bg-secondary font-medium text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50"
                            }`}
                        >
                          <span>{b.emoji}</span>
                          <span className="truncate">{b.name}</span>
                        </div>
                      ))}
                      <div className="text-[9px] text-start tracking-wider text-muted-foreground/60 mb-2 px-1 mt-3">
                        All Boards
                      </div>
                      {[
                        { emoji: "📈", name: "Marketing Q3" },
                        { emoji: "⚙️", name: "Infrastructure" },
                        { emoji: "📚", name: "Knowledge Base" },
                      ].map((b) => (
                        <div
                          key={b.name}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground mb-0.5 hover:bg-secondary/50"
                        >
                          <span>{b.emoji}</span>
                          <span className="truncate">{b.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden p-4 bg-background">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-sm">
                          🚀
                        </div>
                        <span className="text-sm font-bold">Product Launch</span>
                        <Star className="size-3.5 text-amber-400 fill-amber-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 border-b border-border/30 mb-3 pb-2">
                      <div className="flex items-center gap-1.5 text-primary text-[11px] font-medium px-2 py-1 border-b-2 border-primary">
                        <SquareKanban className="size-3.5" />
                        Kanban
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] px-2 py-1">
                        <List className="size-3.5" />
                        List
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] px-2 py-1">
                        <Table2 className="size-3.5" />
                        Table
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex h-7 w-32 sm:w-48 items-center rounded-md border border-border/50 bg-secondary/30 px-2.5">
                        <SearchIcon className="size-3 text-muted-foreground mr-1.5 shrink-0" />
                        <span className="text-[10px] text-muted-foreground truncate">Filter tasks...</span>
                      </div>
                      <div className="flex h-7 items-center justify-center rounded-md border border-border/50 bg-secondary/30 px-2.5 text-[10px] text-muted-foreground font-medium">
                        All
                      </div>
                      <div className="flex h-7 items-center justify-center rounded-md border border-border/50 bg-secondary/30 px-2.5 text-[10px] text-muted-foreground font-medium">
                        Today
                      </div>
                      <div className="flex h-7 items-center justify-center rounded-md border border-border/50 bg-secondary/30 px-2.5 text-[10px] text-muted-foreground font-medium">
                        Overdue
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 h-[calc(100%-120px)]">
                      {(
                        [
                          { status: "todo", label: "To do" },
                          { status: "in-progress", label: "Doing" },
                          { status: "done", label: "Done" },
                        ] as const
                      ).map((col, colIdx) => {
                        const tasks = DEMO_TASKS.filter(
                          (t) => t.status === col.status
                        );
                        return (
                          <div
                            key={col.status}
                            className="rounded-lg bg-secondary p-2 flex flex-col overflow-hidden"
                          >
                            <div className="flex items-center justify-between px-1 mb-2">
                              <span className="text-[11px] font-medium text-start">
                                {col.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {tasks.length}
                              </span>
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                              {tasks.map((task, taskIdx) => (
                                <Card key={task.id} className="border-0 bg-card shadow-sm rounded-lg py-0 gap-0 overflow-hidden">
                                  {task.cover && (
                                    <div
                                      className="w-full h-3 max-h-3"
                                      style={{
                                        backgroundColor: task.cover.value,
                                      }}
                                    />
                                  )}
                                  <div className="p-2.5 pt-2">
                                    <CardHeader className="p-0 gap-0">
                                      <CardTitle className="text-[11px] font-medium leading-tight truncate text-start">
                                        {task.title}
                                      </CardTitle>
                                    </CardHeader>
                                    {task.dueDate && (
                                      <CardDescription className="text-[9px] flex items-center gap-1 mt-1.5">
                                        <Clock className="size-2.5" />
                                        {task.dueDate}
                                      </CardDescription>
                                    )}
                                  </div>
                                </Card>
                              ))}
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 px-1 mt-auto pt-1">
                                <PlusIcon className="size-3" />
                                Add New Task
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <FloatingCard
            className="absolute -right-4 -bottom-6 hidden md:block"
            floatY={[-5, 5]}
            floatRotate={[0.5, 1.5]}
            duration={7}
            delay={0}
          >
            <div className="flex items-center gap-2 text-xs">
              <BarChart3 className="size-4 text-primary" />
              <span className="font-medium">Progress</span>
            </div>
            <div className="mt-2 flex gap-1">
              {[60, 80, 45, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h * 0.3 }}
                  transition={{
                    delay: 1 + i * 0.1,
                    duration: 0.6,
                    ease: "backOut",
                  }}
                  className="w-3 rounded-sm bg-primary/80"
                />
              ))}
            </div>
          </FloatingCard>

          <FloatingCard
            className="absolute -bottom-4 -left-4 hidden md:block"
            floatY={[-4, 6]}
            floatRotate={[-0.5, -1.5]}
            duration={8}
            delay={0.8}
          >
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="font-medium">2 tasks done</span>
            </div>
            <div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "29%" }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </FloatingCard>
        </div>

      </div>
    </Section>
  );
};
