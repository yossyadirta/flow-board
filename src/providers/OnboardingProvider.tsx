"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTooltip } from "@/components/app/OnboardingTooltip";
import { OnboardingContextProvider } from "@/context/OnboardingContext";

import { useTheme } from "next-themes";

import { useIsMobile } from "@/hooks/use-mobile";

// Dynamically import Joyride to avoid SSR issues
const Joyride = dynamic(
  () => import("react-joyride").then((mod) => ({ default: mod.Joyride })),
  { ssr: false }
);

function OnboardingJoyride() {
  const { run, stepIndex, steps, handleJoyrideEvent } = useOnboarding();
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  if (!run || isMobile) return null;

  return (
    <Joyride
      run={run}
      stepIndex={stepIndex}
      steps={steps}
      onEvent={handleJoyrideEvent}
      continuous
      scrollToFirstStep
      tooltipComponent={OnboardingTooltip}
      options={{
        arrowColor: resolvedTheme === "dark" ? "#18181b" : "#ffffff",
        overlayClickAction: false,
        targetWaitTimeout: 10000,
      }}
      styles={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    />
  );
}

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingContextProvider>
      {children}
      <OnboardingJoyride />
    </OnboardingContextProvider>
  );
}
