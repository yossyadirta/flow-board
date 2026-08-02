"use client";

import React from "react";
import { QueryClientProvider } from "./QueryClientProvider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      {children}
    </QueryClientProvider>
  );
}
