"use client";

import { useUIStore } from "@/store/useUIStore";

export const useUI = () => {
  const ui = useUIStore((state) => state.ui);
  const setLastBoardId = useUIStore((state) => state.setLastBoardId);
  const clearLastBoardId = useUIStore((state) => state.clearLastBoardId);
  const setHasSeenOnboarding = useUIStore((state) => state.setHasSeenOnboarding);

  return {
    ui,
    setLastBoardId,
    clearLastBoardId,
    setHasSeenOnboarding,
  };
};
