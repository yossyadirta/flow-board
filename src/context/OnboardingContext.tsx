"use client";

import React, { createContext, useContext, useCallback, useRef } from "react";

export type OnboardingEvent =
  | "create-board-clicked"
  | "board-created"
  | "add-task-clicked"
  | "task-created"
  | "task-moved-to-inprogress"
  | "task-moved-to-done";

type OnboardingEventHandler = (event: OnboardingEvent) => void;

interface OnboardingContextType {
  signalEvent: (event: OnboardingEvent) => void;
  subscribe: (handler: OnboardingEventHandler) => () => void;
  isOnboarding: boolean;
  setIsOnboarding: (value: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  signalEvent: () => {},
  subscribe: () => () => {},
  isOnboarding: false,
  setIsOnboarding: () => {},
});

export const useOnboardingContext = () => useContext(OnboardingContext);

export function OnboardingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const handlersRef = useRef<Set<OnboardingEventHandler>>(new Set());
  const [isOnboarding, setIsOnboarding] = React.useState(false);

  const subscribe = useCallback((handler: OnboardingEventHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const signalEvent = useCallback((event: OnboardingEvent) => {
    handlersRef.current.forEach((handler) => handler(event));
  }, []);

  return (
    <OnboardingContext.Provider
      value={{ signalEvent, subscribe, isOnboarding, setIsOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
