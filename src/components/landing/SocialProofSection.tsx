import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TECH_BADGES } from "./constants";

export const SocialProofSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-12 border-y border-border/30 bg-muted/20">
      <div ref={ref} className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-[0.15em]">
            Built with modern tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {TECH_BADGES.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.1 + i * 0.06,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="flex items-center gap-1.5 rounded-full border border-border/40 bg-card/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-border/70 transition-colors"
              >
                <span className="text-xs opacity-70">{badge.icon}</span>
                <span>{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
