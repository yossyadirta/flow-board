"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export const InteractiveDotGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const dots: { x: number; y: number; baseX: number; baseY: number; size: number }[] = [];
    const spacing = 24;
    const radius = 1.2;

    const initDots = () => {
      dots.length = 0;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          dots.push({ x, y, baseX: x, baseY: y, size: radius });
        }
      }
    };

    initDots();

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initDots();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const isDark = resolvedTheme === "dark";
    // Adjust base opacity for better contrast
    const dotColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)";
    // Use the purple primary color from the theme
    const activeColor = "rgba(124, 58, 237, 0.8)";

    let time = 0;

    const animate = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      const magnetRadius = 120; // Area of effect

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Distance to mouse
        const dx = mouseX - dot.baseX;
        const dy = mouseY - dot.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = dot.baseX;
        let targetY = dot.baseY;
        let currentSize = dot.size;
        let color = dotColor;

        // Magnetic effect (water tension / breathing)
        if (distance < magnetRadius) {
          const force = (magnetRadius - distance) / magnetRadius;
          // Magnet pull towards mouse (elastic effect)
          targetX = dot.baseX + dx * force * 0.4;
          targetY = dot.baseY + dy * force * 0.4;
          currentSize = dot.size + force * 2;
          color = activeColor;
        }

        // Spring physics to move smoothly to target
        dot.x += (targetX - dot.x) * 0.15;
        dot.y += (targetY - dot.y) * 0.15;

        // Organic breathing effect using sine wave based on position and time
        const breathing = Math.sin(time + dot.baseX * 0.02 + dot.baseY * 0.02) * 0.4;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.1, currentSize + breathing), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
};
