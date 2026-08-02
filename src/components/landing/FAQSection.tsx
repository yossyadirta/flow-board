import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "./Section";

const FAQS = [
  {
    question: "Where is my data stored?",
    answer:
      "All your data is securely stored in the cloud using Supabase, ensuring real-time synchronization across all your devices and immediate collaboration.",
  },
  {
    question: "Is Flowboard really free to use?",
    answer:
      "Yes! Flowboard is currently an open-source portfolio project designed to demonstrate advanced UI/UX patterns and real-time collaboration architecture. There are no hidden fees or premium tiers.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We utilize Row Level Security (RLS) policies within our database to ensure your tasks and boards are only accessible to you and your invited team members.",
  },
  {
    question: "What tech stack is powering this?",
    answer:
      "Flowboard is built with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui. Animations are powered by Framer Motion, and drag-and-drop utilizes dnd-kit for native-feel physics.",
  },
];

export const FAQSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section id="faq" className="relative py-24 sm:py-32">
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Everything you need to know about how Flowboard works under the hood.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border/40 bg-card rounded-lg px-4 shadow-sm"
              >
                <AccordionTrigger className="text-left font-medium text-sm sm:text-base hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </Section>
  );
};
