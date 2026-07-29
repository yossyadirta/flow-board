import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="h-full p-2 md:p-3 overflow-hidden animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 w-full h-full bg-secondary rounded-2xl overflow-hidden p-4 md:p-5">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div>
            <Skeleton className="h-3 w-24 mb-1.5" />
            <Skeleton className="h-7 w-44" />
          </div>
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>

        <div className="flex flex-col gap-3 xl:hidden flex-1">
          <Skeleton className="h-72 rounded-xl shrink-0" />
          <Skeleton className="h-64 rounded-xl shrink-0" />
          <Skeleton className="h-64 rounded-xl shrink-0" />
          <Skeleton className="h-72 rounded-xl shrink-0" />
          <Skeleton className="h-72 rounded-xl shrink-0" />
        </div>

        <div
          className="hidden xl:grid h-full gap-2 flex-1 min-h-0"
          style={{
            gridTemplateColumns: "2fr 2fr 2.5fr 1.5fr 2fr",
            gridTemplateRows: "2.5fr 1fr 1.5fr",
            gridTemplateAreas: `
              "focus chart chart chart ring"
              "focus proj  proj  act   act"
              "focus proj  proj  cal   cal"
            `,
          }}
        >
          <div style={{ gridArea: "focus" }} className="rounded-2xl bg-card overflow-hidden flex flex-col p-4 gap-3">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-40" />
            <div className="space-y-3 mt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-3/4 mb-1.5" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridArea: "chart" }} className="rounded-2xl bg-card overflow-hidden flex flex-col p-4 gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2 mt-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
            <Skeleton className="flex-1 min-h-[100px] rounded-lg mt-2" />
          </div>

          <div style={{ gridArea: "ring" }} className="rounded-2xl bg-card overflow-hidden flex flex-col p-4 items-center justify-center gap-4">
            <Skeleton className="h-4 w-20 self-start" />
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>

          <div style={{ gridArea: "proj" }} className="rounded-2xl bg-card overflow-hidden flex flex-col p-4 gap-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-col gap-4 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridArea: "act" }} className="rounded-2xl bg-card overflow-hidden flex flex-col p-4 gap-3">
            <Skeleton className="h-4 w-28" />
            <div className="flex flex-col gap-4 mt-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-full mb-1.5" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridArea: "cal" }} className="rounded-2xl bg-card overflow-hidden flex flex-col p-4 gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="flex-1 min-h-[60px] rounded-lg mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
