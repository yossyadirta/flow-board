import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function KanbanSkeleton() {
  return (
    <ScrollArea className="w-full h-full whitespace-nowrap [&>div>div]:block! [&>div>div]:h-full! animate-in fade-in duration-300">
      <div className="grid grid-flow-col auto-cols-[300px] gap-4 items-start h-full w-max pb-4">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="flex flex-col h-full bg-secondary/30 rounded-xl p-3 border border-border/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>

            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="p-3 border-0 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-full mr-4" />
                  </div>
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function ListSkeleton() {
  return (
    <ScrollArea className="h-full w-full pr-4 animate-in fade-in duration-300">
      <div className="flex flex-col gap-6 pb-6">
        {[1, 2, 3].map((group) => (
          <div key={group} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-8 rounded-full ml-2" />
            </div>

            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 w-1/2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-md border h-full flex flex-col animate-in fade-in duration-300 bg-card">
      <div className="flex items-center gap-4 border-b bg-muted/50 p-3 px-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div key={row} className="flex items-center gap-4 border-b p-3 px-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function BoardPageSkeleton() {
  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-5 shrink-0 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32 md:w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 md:h-10 md:w-10 rounded-full" />
          <Skeleton className="h-9 w-24 md:h-10 md:w-28 rounded-full" />
        </div>
      </div>

      <div className="flex-1 min-h-0 p-4 md:p-5">
        <KanbanSkeleton />
      </div>
    </div>
  );
}
