"use client";

import { UIState } from "@/types/ui";
import { useEffect, useState } from "react";

const STORAGE_KEY = "flowboard:ui";

const DEFAULT_UI: UIState = {
  lastBoardId: "",
  hasSeenOnboarding: false,
};

export const useUI = () => {
  // hydrate
  const [ui, setUI] = useState<UIState>(() => {
    if (typeof window === "undefined") return DEFAULT_UI;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_UI;

      return { ...DEFAULT_UI, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_UI;
    }
  });

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ui));
  }, [ui]);

  const setLastBoardId = (id: string) =>
    setUI((prev) => ({ ...prev, lastBoardId: id }));

  const clearLastBoardId = () =>
    setUI((prev) => {
      const newData = prev;
      delete newData.lastBoardId;

      return prev;
    });

  const setHasSeenOnboarding = () =>
    setUI((prev) => ({ ...prev, hasSeenOnboarding: true }));

  return {
    ui,
    setLastBoardId,
    clearLastBoardId,
    setHasSeenOnboarding,
  };
};
