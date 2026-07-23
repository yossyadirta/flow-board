"use client";

import React from "react";
import { TooltipRenderProps } from "react-joyride";
import { X } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/onboardingSteps";

export function OnboardingTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
  skipProps,
}: TooltipRenderProps) {
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = ((index + 1) / totalSteps) * 100;
  const hideFooter = (step.data as { hideFooter?: boolean })?.hideFooter ?? false;
  const hideBack = (step.data as { hideBack?: boolean })?.hideBack ?? false;
  const hideNext = (step.data as { hideNext?: boolean })?.hideNext ?? false;
  const hideSkip = (step.data as { hideSkip?: boolean })?.hideSkip ?? false;

  return (
    <div
      {...tooltipProps}
      className="relative bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60 rounded-2xl shadow-2xl max-w-sm w-[340px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-zinc-800 w-full">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-5 pb-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
              {index + 1}
            </div>
            {step.title && (
              <h3 className="text-sm font-bold text-foreground leading-tight">
                {step.title as string}
              </h3>
            )}
          </div>
          <button
            {...closeProps}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
            aria-label="Close tour"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed pl-[38px]">
          {step.content as string}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground/60 tracking-wide">
          {index + 1} / {totalSteps}
        </span>

        <div className="flex items-center gap-2">
          {!hideFooter && !hideBack && index > 0 && (
            <button
              {...backProps}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Back
            </button>
          )}

          {!hideFooter && !hideSkip && (
            <button
              {...skipProps}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
          )}

          {!hideFooter && !hideNext && continuous && (
            <button
              {...primaryProps}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
            >
              {isLastStep ? "Finish! 🎉" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
