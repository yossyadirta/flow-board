import React from "react";
import { motion } from "framer-motion";
import { Section } from "./Section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    text: "Flowboard fundamentally changed how our engineering team ships. The real-time sync is pure magic.",
    author: "Sarah J.",
    role: "Lead Engineer",
    color: "#3B82F6",
  },
  {
    text: "Finally, a task manager that doesn't feel like a chore to use. The UI is breathtaking.",
    author: "Michael T.",
    role: "Product Designer",
    color: "#F59E0B",
  },
  {
    text: "It's like Trello and Linear had a baby. The multi-view engine saves me hours of context switching.",
    author: "Elena R.",
    role: "Product Manager",
    color: "#EC4899",
  },
  {
    text: "The drag and drop physics are so satisfying. It's the attention to detail that sets Flowboard apart.",
    author: "David K.",
    role: "Frontend Dev",
    color: "#10B981",
  },
  {
    text: "Row-Level Security right out of the box? Our CTO approved this for enterprise use instantly.",
    author: "Amanda L.",
    role: "Engineering Manager",
    color: "#8B5CF6",
  },
  {
    text: "I've tried them all. Flowboard is the only tool that can keep up with my chaotic workflow.",
    author: "James W.",
    role: "Creative Director",
    color: "#F43F5E",
  },
];

export const TestimonialSection = () => {
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <Section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden border-t border-border/30 bg-muted/10">

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-6 text-center mb-16 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Wall of Love
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          See what product leaders and engineers are saying about their new workflow.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden w-full group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-6 py-4 px-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedTestimonials.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[320px] sm:w-[400px] bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-foreground text-sm sm:text-base font-medium mb-6 leading-relaxed">
                &quot;{item.text}&quot;
              </p>

              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-background shadow-sm">
                  <AvatarFallback className="text-white text-xs font-semibold" style={{ backgroundColor: item.color }}>
                    {item.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold text-foreground">{item.author}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};
