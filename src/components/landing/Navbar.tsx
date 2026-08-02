import React, { useState, useEffect } from "react";
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
    const timer = setTimeout(() => setMounted(true), 0);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDark = resolvedTheme === "dark";

  const navLinks = [
    { href: "#views", label: "Views" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Wall of Love" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-5 py-3.5 transition-all duration-500 md:px-10 lg:px-20 ${
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b border-border/40 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <a 
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-80"
      >
        <Image src="/logo.svg" alt="Flowboard" width={22} height={22} />
        <span className="text-base font-semibold tracking-tight">
          Flowboard
        </span>
      </a>

      <div className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent/50"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted && isDark ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
        <Button
          size="sm"
          className="gap-1.5 cursor-pointer text-xs h-8 px-4 shadow-lg shadow-primary/15"
          onClick={onLaunchApp}
        >
          Get Started
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </motion.nav>
  );
};
