import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface NavbarProps {
  onLaunchApp?: (e: React.MouseEvent) => void;
}

export const Navbar = ({ onLaunchApp }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 md:px-12 lg:px-24 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Image src="/logo.svg" alt="Flowboard" width={24} height={24} />
        <span className="text-lg font-semibold tracking-tight">Flowboard</span>
      </div>
      <div className="hidden items-center gap-6 md:flex">
        <a
          href="#demo"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Demo
        </a>
        <a
          href="#features"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Features
        </a>
        <a
          href="#tech"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Architecture
        </a>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted && isDark ? (
            <Sun className="size-4.5" />
          ) : (
            <Moon className="size-4.5" />
          )}
        </Button>
        <Button size="sm" className="gap-1.5 cursor-pointer" onClick={onLaunchApp}>
          Get Started for Free
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </motion.nav>
  );
};
