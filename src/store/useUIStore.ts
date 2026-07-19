import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UIState } from "@/types/ui";

interface UIStore {
  ui: UIState;
  setLastBoardId: (id: string) => void;
  clearLastBoardId: () => void;
  setHasSeenOnboarding: () => void;
}

const DEFAULT_UI: UIState = {
  lastBoardId: "",
  hasSeenOnboarding: false,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ui: DEFAULT_UI,
      setLastBoardId: (id) =>
        set((state) => ({ ui: { ...state.ui, lastBoardId: id } })),
      clearLastBoardId: () =>
        set((state) => {
          const newUI = { ...state.ui };
          delete newUI.lastBoardId;
          return { ui: newUI };
        }),
      setHasSeenOnboarding: () =>
        set((state) => ({ ui: { ...state.ui, hasSeenOnboarding: true } })),
    }),
    {
      name: "flowboard:ui",
      // Map storage to keep matching the localStorage key name from useUI
    }
  )
);
