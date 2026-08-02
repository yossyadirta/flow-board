import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MousePointer2, Users, MessageSquareText, Clock } from "lucide-react";
import { Section } from "./Section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const CURSORS = [
  {
    id: "c1",
    name: "Alex",
    color: "#F59E0B",
    path: [
      { x: -50, y: 150 },
      { x: 120, y: 80 },
      { x: 120, y: 80 }, // pause
      { x: 280, y: 160 },
      { x: -50, y: 150 },
    ],
    delay: 0,
  },
  {
    id: "c2",
    name: "Sarah",
    color: "#EC4899",
    path: [
      { x: 450, y: 50 },
      { x: 300, y: 220 },
      { x: 300, y: 220 }, // pause
      { x: 150, y: 100 },
      { x: 450, y: 50 },
    ],
    delay: 2,
  },
  {
    id: "c3",
    name: "Mike",
    color: "#3B82F6",
    path: [
      { x: 200, y: 350 },
      { x: 100, y: 200 },
      { x: 380, y: 120 },
      { x: 380, y: 120 }, // pause
      { x: 200, y: 350 },
    ],
    delay: 4,
  },
];

export const CollabSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section className="relative overflow-hidden pt-24 pb-32 border-y border-border/30 bg-muted/10">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-4 text-xs font-semibold">
                <Users className="size-3.5" />
                Realtime Sync
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Work together, <br />
                <span className="text-muted-foreground">like you&apos;re in the same room.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Experience instant collaboration. See your team&apos;s cursors fly across the board, watch tasks move in real-time, and leave comments that update instantly without ever refreshing the page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { label: "Live Cursors", val: "Yes", icon: MousePointer2 },
                { label: "Latency", val: "< 50ms", icon: Clock },
                { label: "Live Comments", val: "Instant", icon: MessageSquareText },
                { label: "Conflict Resolution", val: "Auto", icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 border border-border/40 bg-card rounded-lg p-3 shadow-sm">
                  <div className="bg-muted/50 p-2 rounded-md">
                    <stat.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="font-semibold text-sm">{stat.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
            animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative perspective-1000"
          >
            <div className="relative rounded-2xl border border-border/30 bg-card shadow-2xl shadow-primary/5 overflow-hidden ring-1 ring-white/10">

              <div className="flex items-center justify-between border-b border-border/20 px-4 py-3 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-red-400/80" />
                    <div className="size-2.5 rounded-full bg-amber-400/80" />
                    <div className="size-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-medium ml-2">Q3 Planning</Badge>
                </div>

                <div className="flex -space-x-2">
                  {[
                    { bg: "#F59E0B", letter: "A" },
                    { bg: "#EC4899", letter: "S" },
                    { bg: "#3B82F6", letter: "M" },
                    { bg: "#10B981", letter: "Y" },
                  ].map((a, i) => (
                    <motion.div
                      key={a.letter}
                      initial={{ opacity: 0, x: 10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="rounded-full ring-2 ring-card relative z-10"
                    >
                      <Avatar className="size-7 border-none">
                        <AvatarFallback className="text-white text-[10px] font-bold" style={{ backgroundColor: a.bg }}>
                          {a.letter}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="h-[320px] bg-background/50 relative p-6">
                <div className="absolute top-8 left-8 w-48 bg-card rounded-lg border shadow-sm p-3">
                  <div className="h-1.5 w-1/3 bg-amber-500 rounded-full mb-3" />
                  <div className="text-xs font-semibold mb-2">Finalize Q3 Budget</div>
                  <div className="h-2 w-full bg-muted/50 rounded-full mb-1" />
                  <div className="h-2 w-2/3 bg-muted/50 rounded-full" />
                </div>

                <div className="absolute top-24 right-12 w-56 bg-card rounded-lg border shadow-sm p-3">
                  <div className="h-1.5 w-1/4 bg-primary rounded-full mb-3" />
                  <div className="text-xs font-semibold mb-2">Hire Senior Designer</div>
                  <div className="flex items-center gap-2 mt-3">
                    <Avatar className="size-5">
                      <AvatarFallback className="bg-pink-500 text-[8px] text-white">S</AvatarFallback>
                    </Avatar>
                    <div className="text-[9px] text-muted-foreground">In Progress</div>
                  </div>
                </div>

                {/* Fake Task Card 3 */}
                <div className="absolute bottom-10 left-32 w-52 bg-card rounded-lg border shadow-sm p-3 opacity-60">
                  <div className="h-1.5 w-1/5 bg-emerald-500 rounded-full mb-3" />
                  <div className="text-xs font-semibold line-through text-muted-foreground mb-2">Update Pitch Deck</div>
                </div>

                {CURSORS.map((cursor) => (
                  <motion.div
                    key={cursor.id}
                    className="absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-start drop-shadow-md"
                    animate={{
                      x: cursor.path.map(p => p.x),
                      y: cursor.path.map(p => p.y),
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      delay: cursor.delay,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={cursor.color}
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="origin-top-left -rotate-12 drop-shadow-sm"
                    >
                      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                      <path d="m13 13 6 6" />
                    </svg>
                    <div
                      className="px-2 py-0.5 rounded-full text-[9px] text-white font-medium mt-1 whitespace-nowrap shadow-sm"
                      style={{ backgroundColor: cursor.color }}
                    >
                      {cursor.name}
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </Section>
  );
};
