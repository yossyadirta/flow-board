"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-zinc-950 overflow-hidden px-4">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-900/20 rounded-full filter blur-[100px] opacity-50 dark:opacity-30 mix-blend-multiply animate-blob" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-300 dark:bg-blue-900/20 rounded-full filter blur-[100px] opacity-50 dark:opacity-30 mix-blend-multiply animate-blob animation-delay-2000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 flex flex-col items-center text-center"
      >
        <div className="mb-8 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center justify-center size-24 bg-secondary border border-border/50 rounded-3xl shadow-xl mx-auto"
          >
            <SearchX className="size-10 text-muted-foreground" />
          </motion.div>
          <div className="absolute -bottom-4 -right-4 bg-background border border-border/50 rounded-full p-2 shadow-sm">
            <Image
              src="/logo.svg"
              alt="Flowboard"
              width={20}
              height={20}
            />
          </div>
        </div>

        <h1 className="text-7xl font-black tracking-tight text-foreground mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Page not found
        </h2>

        <p className="text-muted-foreground mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button asChild className="w-full flex-1 gap-2 rounded-xl" size="lg">
            <Link href="/">
              <Home className="size-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full flex-1 gap-2 rounded-xl border-slate-300 dark:border-slate-800"
            size="lg"
          >
            <Link href="/app">
              Go to Dashboard
              <ArrowLeft className="size-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
