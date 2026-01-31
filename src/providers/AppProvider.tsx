"use client";

import { AppContext } from "@/app/context/AppContext";
import { initialState } from "@/app/state/initialState";
import { rootReducer } from "@/app/state/rootReducer";
import { useEffect, useReducer } from "react";

const STORAGE_KEY = "flowboard:state";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(rootReducer, initialState, (base) => {
    if (typeof window === "undefined") return base;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...base, ...JSON.parse(raw) } : base;
    } catch {
      return base;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
