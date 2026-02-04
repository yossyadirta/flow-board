"use client";

import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppProvider");
  }
  return ctx;
};
