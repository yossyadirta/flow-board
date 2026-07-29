"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EventData, STATUS, EVENTS, ACTIONS, Controls } from "react-joyride";
import { ONBOARDING_STEPS } from "@/lib/onboardingSteps";
import { useUIStore } from "@/store/useUIStore";
import { useOnboardingContext, OnboardingEvent } from "@/context/OnboardingContext";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export const useOnboarding = () => {
  const [run, setRun] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasCheckedRef = useRef(false);
  const controlsRef = useRef<Controls | null>(null);
  const { subscribe, setIsOnboarding } = useOnboardingContext();

  const hasSeenOnboarding = useUIStore((state) => state.ui.hasSeenOnboarding);
  const setHasSeenOnboarding = useUIStore(
    (state) => state.setHasSeenOnboarding
  );
  const onboardingStepIndex = useUIStore((state) => state.ui.onboardingStepIndex ?? 0);
  const setOnboardingStepIndex = useUIStore((state) => state.setOnboardingStepIndex);

  const [stepIndex, setStepIndexLocal] = useState(onboardingStepIndex);

  // Wrapper for setStepIndex to also persist to store
  const setStepIndex = useCallback((index: number) => {
    setStepIndexLocal(index);
    setOnboardingStepIndex(index);
  }, [setOnboardingStepIndex]);

  // Check if user needs onboarding
  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const checkOnboarding = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Guest user: check localStorage via Zustand
        if (user.is_anonymous) {
          if (!hasSeenOnboarding) {
            if (onboardingStepIndex > 0) {
              setHasSeenOnboarding();
              setOnboardingStepIndex(0);
            } else {
              setRun(true);
              setIsOnboarding(true);
            }
          }
          setLoading(false);
          return;
        }

        // Authenticated user: check Supabase profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_seen_onboarding")
          .eq("id", user.id)
          .single();

        if (profile && !profile.has_seen_onboarding) {
          if (onboardingStepIndex > 0) {
            setHasSeenOnboarding();
            setOnboardingStepIndex(0);
            await supabase
              .from("profiles")
              .update({ has_seen_onboarding: true })
              .eq("id", user.id);
          } else {
            setRun(true);
            setIsOnboarding(true);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [hasSeenOnboarding, setIsOnboarding, onboardingStepIndex, setHasSeenOnboarding, setOnboardingStepIndex]);

  // Complete onboarding — update both localStorage and Supabase
  const completeOnboarding = useCallback(async () => {
    setRun(false);
    setIsOnboarding(false);

    // Always set localStorage (covers guest users)
    setHasSeenOnboarding();

    // Reset the step index in store when completed
    setOnboardingStepIndex(0);

    // Also update Supabase for authenticated users
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && !user.is_anonymous) {
        await supabase
          .from("profiles")
          .update({ has_seen_onboarding: true })
          .eq("id", user.id);
      }
    } catch (error) {
      console.error("Error updating onboarding status:", error);
    }
  }, [setHasSeenOnboarding, setIsOnboarding]);

  // Listen for onboarding events from components
  useEffect(() => {
    const unsubscribe = subscribe((event: OnboardingEvent) => {
      if (!run) return;

      switch (event) {
        case "create-board-clicked":
          setStepIndex(1);
          break;

        case "board-created":
          setStepIndex(2);
          break;

        case "add-task-clicked":
          setStepIndex(3);
          break;

        case "task-created":
          setStepIndex(4);
          break;

        case "task-moved-to-inprogress":
          setStepIndex(5);
          break;

        case "task-moved-to-done":
          completeOnboarding();
          break;
      }
    });

    return unsubscribe;
  }, [run, subscribe, completeOnboarding]);

  const pathname = usePathname();
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current && run && stepIndex > 0) {
      isInitialMount.current = false;
      completeOnboarding();
      return;
    }
    isInitialMount.current = false;
    
    if (run && pathname === "/app" && stepIndex >= 2) {
      completeOnboarding();
    }
  }, [run, pathname, stepIndex, completeOnboarding]);

  const handleJoyrideEvent = useCallback(
    (data: EventData, controls: Controls) => {
      const { status, action, index, type } = data;

      // Store controls ref for programmatic use
      controlsRef.current = controls;

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        completeOnboarding();
        return;
      }

      if (type === EVENTS.TARGET_NOT_FOUND || type === EVENTS.ERROR) {
        completeOnboarding();
        return;
      }

      if (type === EVENTS.STEP_AFTER) {
        if (action === ACTIONS.NEXT) {
          setStepIndex(index + 1);
        } else if (action === ACTIONS.PREV) {
          setStepIndex(index - 1);
        }
      }

      if (action === ACTIONS.CLOSE) {
        completeOnboarding();
      }
    },
    [completeOnboarding, setStepIndex]
  );

  return {
    run,
    stepIndex,
    steps: ONBOARDING_STEPS,
    handleJoyrideEvent,
    loading,
    completeOnboarding,
    setStepIndex,
    setRun,
  };
};
