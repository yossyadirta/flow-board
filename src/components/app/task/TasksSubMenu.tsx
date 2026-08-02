"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Inbox, Sun, CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";

export function TasksSubMenu() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const filters = [
    { id: "all", label: "All Tasks", icon: Inbox, color: "text-blue-500" },
    { id: "today", label: "Today", icon: Sun, color: "text-amber-500" },
    { id: "next-7-days", label: "Next 7 Days", icon: CalendarDays, color: "text-purple-500" },
    { id: "overdue", label: "Overdue", icon: AlertCircle, color: "text-red-500" },
    { id: "completed", label: "Completed", icon: CheckCircle2, color: "text-primary" },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col pt-4">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Task Filters</SidebarGroupLabel>
          <SidebarMenu>
            {filters.map((f) => {
              const isActive = filter === f.id;
              const Icon = f.icon;

              return (
                <SidebarMenuItem key={f.id}>
                  <SidebarMenuButton isActive={isActive} asChild>
                    <Link
                      href={f.id === "all" ? "/app/tasks" : `/app/tasks?filter=${f.id}`}
                      className="flex items-center gap-2"
                    >
                      <Icon size={16} className={f.color} />
                      <span className={isActive ? "font-semibold text-foreground" : "text-muted-foreground"}>
                        {f.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
}
