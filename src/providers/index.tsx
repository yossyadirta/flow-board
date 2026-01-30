"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AppProvider } from "./AppProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AppProvider>
  );
}
