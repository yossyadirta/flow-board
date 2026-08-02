import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./Section";
import { MagneticButton } from "./MagneticButton";

export const CTAFooter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-primary/[0.04] pointer-events-none" />

      <div ref={ref} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Ready to find
            <br />
            <span className="text-primary">your flow?</span>
          </h2>
          <p className="mb-10 max-w-md text-sm sm:text-base text-muted-foreground">
            Start managing your productivity with the speed and elegance of a
            modern tool. Free to use, no credit card required.
          </p>

          <MagneticButton>
            <Button
              asChild
              size="lg"
              className="group gap-2 px-6 sm:px-10 py-4 sm:py-6 text-sm sm:text-base shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Link href="/app">
                Open Flowboard — It&apos;s Free
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="size-4" />
                </motion.span>
              </Link>
            </Button>
          </MagneticButton>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Free forever
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              No credit card
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Cloud sync included
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-24 border-t border-border/20 pt-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src="/logo.svg" alt="Flowboard" width={16} height={16} />
          <span className="font-medium text-foreground">Flowboard</span>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Flowboard. Crafted for productive
          minds.
        </p>
      </div>
    </Section>
  );
};
