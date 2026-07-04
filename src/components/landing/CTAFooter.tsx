import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./Section";
import { MagneticButton } from "./MagneticButton";

export const CTAFooter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section className="relative">
      <div ref={ref} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Ready to streamline
            <br />
            <span className="text-primary">
              your workflow?
            </span>
          </h2>
          <p className="mb-10 max-w-md text-muted-foreground">
            Start managing your productivity with the speed and elegance of a
            modern tool. No sign-up required.
          </p>

          <MagneticButton>
            <Button
              asChild
              size="lg"
              className="group gap-2 px-6 sm:px-10 py-4 sm:py-6 text-sm sm:text-base shadow-lg shadow-primary/20"
            >
              <Link href="/app" target="_blank" rel="noopener noreferrer">
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
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="size-4" />
              100% Local Storage
            </span>
            <span className="text-border">•</span>
            <span>Built with Next.js & TypeScript</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-24 border-t border-border/30 pt-8 text-center text-xs text-muted-foreground">
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
