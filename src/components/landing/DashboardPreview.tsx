import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingUp,
  Target,
  Activity,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Section } from "./Section";

const BENTO_ITEMS = [
  {
    id: "focus",
    title: "Today's Focus",
    gridArea: "focus",
    content: (
      <div className="space-y-1.5">
        {[
          { label: "Setup database schema", tag: "Overdue", tagColor: "text-rose-500 bg-rose-500/10" },
          { label: "Build list view layout", tag: "Due Today", tagColor: "text-amber-500 bg-amber-500/10" },
          { label: "Implement drag & drop", tag: "Active", tagColor: "text-indigo-500 bg-indigo-500/10" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent/30 transition-colors"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${item.tagColor.includes("rose") ? "bg-rose-500" : item.tagColor.includes("amber") ? "bg-amber-500" : "bg-indigo-500"}`} />
            <span className="text-[10px] font-medium flex-1 truncate">
              {item.label}
            </span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${item.tagColor}`}>
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    ),
    icon: Target,
  },
  {
    id: "chart",
    title: "Task Activity",
    gridArea: "chart",
    content: (
      <div className="flex items-end gap-1.5 h-16 pt-2">
        {[35, 55, 25, 70, 45, 80, 60].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: "backOut" }}
              className="w-full rounded-sm bg-primary/70"
            />
            <span className="text-[7px] text-muted-foreground">
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </span>
          </div>
        ))}
      </div>
    ),
    icon: BarChart3,
  },
  {
    id: "progress",
    title: "Today's Progress",
    gridArea: "progress",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth="3"
            />
            <motion.circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="87.96"
              initial={{ strokeDashoffset: 87.96 }}
              whileInView={{ strokeDashoffset: 87.96 * 0.35 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            65%
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">5 of 8 done</span>
      </div>
    ),
    icon: CheckCircle2,
  },
  {
    id: "projects",
    title: "Projects",
    gridArea: "projects",
    content: (
      <div className="space-y-1.5">
        {[
          { emoji: "🚀", name: "Product Launch", progress: 67 },
          { emoji: "📈", name: "Marketing Q3", progress: 42 },
          { emoji: "⚙️", name: "Infrastructure", progress: 85 },
        ].map((proj) => (
          <div
            key={proj.name}
            className="flex items-center gap-2"
          >
            <span className="text-xs">{proj.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-medium truncate block">
                {proj.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1 flex-1 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary/70"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${proj.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground font-medium">
                  {proj.progress}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    icon: Activity,
  },
  {
    id: "trend",
    title: "Productivity Trend",
    gridArea: "trend",
    content: (
      <div className="flex items-center gap-2">
        <TrendingUp className="size-5 text-emerald-500" />
        <div>
          <span className="text-lg font-bold">+23%</span>
          <span className="text-[10px] text-muted-foreground ml-1">this week</span>
        </div>
      </div>
    ),
    icon: TrendingUp,
  },
  {
    id: "recent",
    title: "Recent Activity",
    gridArea: "recent",
    content: (
      <div className="space-y-1.5">
        {[
          { text: "Completed \"Design system components\"", time: "2m ago" },
          { text: "Created \"Calendar view integration\"", time: "1h ago" },
          { text: "Moved \"Build list view\" to In Progress", time: "3h ago" },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-start gap-2"
          >
            <div className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-medium block truncate">
                {item.text}
              </span>
              <span className="text-[8px] text-muted-foreground">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    ),
    icon: Clock,
  },
];

export const DashboardPreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section id="dashboard" className="relative">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
            Your productivity,{" "}
            <span className="text-primary">at a glance.</span>
          </h2>
          <p className="mx-auto max-w-lg px-4 text-sm text-muted-foreground">
            A bento-style dashboard with real-time widgets — today&apos;s focus,
            task activity charts, workflow progress, and recent activity. All in one
            view.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-border/30 bg-background/40 backdrop-blur-3xl p-1 shadow-2xl ring-1 ring-white/10">
            <div className="rounded-xl bg-secondary p-2">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateAreas: `
                    "focus chart  chart   chart progress"
                    "focus projects trend recent recent"
                    "focus projects trend recent recent"
                  `,
                  gridTemplateColumns: "2fr 2fr 2.5fr 1.5fr 2fr",
                  gridTemplateRows: "180px 70px 100px",
                }}
              >
                {BENTO_ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      style={{ gridArea: item.gridArea }}
                      initial={{ opacity: 0, scale: 0.95, y: 12 }}
                      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{
                        delay: 0.3 + i * 0.06,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="bg-card/80 backdrop-blur-xl rounded-xl p-3 border border-border/40 shadow-sm ring-1 ring-white/5 overflow-hidden transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon className="size-3 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-foreground/80">
                          {item.title}
                        </span>
                      </div>
                      {item.content}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
