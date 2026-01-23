"use client";

import { useReducer } from "react";
import { rootReducer } from "../state/rootReducer";
import { initialState } from "../state/initialState";

export const useAppState = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return { state, dispatch };
};
