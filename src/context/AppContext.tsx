"use client";

import { AppState } from "@/types/state";
import { createContext } from "react";
import { Action } from "@/state/actions";

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);
