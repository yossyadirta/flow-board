import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FEATURES } from "./constants";
import { Section } from "./Section";

export const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <Section id="features" className="relative overflow-hidden py-24 sm:py-32">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </motion.div>

      <div ref={containerRef} className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 text-center max-w-3xl mx-auto px-4"
        >
          <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-balance leading-[1.1]">
            Powerful primitives. <br className="hidden sm:block" />
            <span className="text-primary">Infinite possibilities.</span>
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
            We stripped away the clutter and rebuilt workspace organization from first principles.
            Experience a workspace that adapts to your mind, not the other way around.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-8">
          <motion.div
            style={{ y: y1 }}
            className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 md:p-10 transition-all hover:shadow-2xl hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6 inline-flex rounded-xl border border-border/40 bg-background/50 p-3 shadow-sm">
                {React.createElement(FEATURES[0].icon, { className: "size-6 text-foreground" })}
              </div>
              <h3 className="mb-3 text-2xl font-bold tracking-tight">
                {FEATURES[0].title}
              </h3>
              <p className="text-muted-foreground text-base max-w-md">
                {FEATURES[0].description}
              </p>

              {/* Decorative graphic */}
              <div className="mt-8 relative h-32 overflow-hidden rounded-xl bg-muted/30 border border-border/50">
                <div className="absolute right-4 bottom-4 flex gap-2">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="w-16 rounded-md bg-card shadow-sm border p-2"
                  >
                    <div className="mb-2 h-1 w-full rounded bg-muted-foreground/20" />
                    <div className="h-8 rounded bg-primary/20" />
                  </motion.div>
                  <motion.div
                    initial={{ y: 30, opacity: 0, rotate: -5 }}
                    whileInView={{ y: 10, opacity: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="w-16 rounded-md bg-card shadow-lg border-primary/50 border-2 p-2 relative z-10"
                  >
                    <div className="mb-2 h-1 w-full rounded bg-muted-foreground/20" />
                    <div className="h-6 rounded bg-primary/40" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            className="md:col-span-1 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 transition-all hover:shadow-2xl hover:border-amber-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6 inline-flex rounded-xl border border-border/40 bg-background/50 p-3 shadow-sm">
                {React.createElement(FEATURES[1].icon, { className: "size-6 text-foreground" })}
              </div>
              <h3 className="mb-3 text-2xl font-bold tracking-tight">
                {FEATURES[1].title}
              </h3>
              <p className="text-muted-foreground text-base">
                {FEATURES[1].description}
              </p>

              <div className="mt-auto pt-8 flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-dashed border-muted-foreground/20 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-2 border-2 border-amber-500/30 rounded-full flex items-center justify-center">
                    {React.createElement(FEATURES[1].icon, { className: "size-6 text-amber-500/80" })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 transition-all hover:shadow-2xl hover:border-indigo-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
            <div className="relative z-10">
              <div className="mb-6 inline-flex rounded-xl border border-border/40 bg-background/50 p-3 shadow-sm">
                {React.createElement(FEATURES[2].icon, { className: "size-6 text-foreground" })}
              </div>
              <h3 className="mb-3 text-xl font-bold tracking-tight">
                {FEATURES[2].title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {FEATURES[2].description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 transition-all hover:shadow-2xl hover:border-emerald-500/30 flex flex-col md:flex-row gap-6 items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
            <div className="relative z-10 flex-1">
              <div className="mb-6 inline-flex rounded-xl border border-border/40 bg-background/50 p-3 shadow-sm">
                {React.createElement(FEATURES[3].icon, { className: "size-6 text-foreground" })}
              </div>
              <h3 className="mb-3 text-xl font-bold tracking-tight">
                {FEATURES[3].title}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {FEATURES[3].description}
              </p>
            </div>
            <div className="relative w-full md:w-48 h-24 rounded-xl bg-muted/40 border border-border/50 overflow-hidden shrink-0">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1.5">
                <div className="size-3 rounded-full bg-emerald-500/20 animate-pulse" />
                <div className="size-3 rounded-full bg-emerald-500/60 animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="size-3 rounded-full bg-emerald-500/100 animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
