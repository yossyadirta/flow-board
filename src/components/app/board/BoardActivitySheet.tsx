import React from "react";
import { History, CheckCircle2, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const RecentActivityItem = ({ task, currentUserId }: { task: Task, currentUserId: string | null }) => {
  const isDone = task.status === "done";
  
  const authorName = task.author?.name || "Someone";
  const isMe = currentUserId && task.author?.id === currentUserId;
  const displayName = isMe ? `${authorName} (You)` : authorName;
  const initials = authorName.charAt(0).toUpperCase();
  
  return (
    <div className="relative flex items-center justify-normal group is-active">
      <Avatar className="w-6 h-6 md:w-8 md:h-8 shadow shrink-0 z-10 border-2 border-background">
        <AvatarFallback style={{ backgroundColor: task.author?.bg_color || "#9CA3AF" }} className="text-white text-[10px] md:text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="w-[calc(100%-2.5rem)] md:w-[calc(100%-3rem)] p-2.5 md:p-3 rounded-lg border bg-card shadow-sm ml-3 md:ml-4">
        <p className="text-xs md:text-sm text-foreground line-clamp-2 leading-relaxed">
          <span className="font-semibold">{displayName}</span> {isDone ? "completed" : "created"} task{" "}
          <span className="font-medium">{task.title}</span>
        </p>
        <time className="text-[10px] md:text-xs text-muted-foreground flex items-center mt-1.5">
          <Calendar className="h-3 w-3 mr-1" />
          {format(new Date(task.createdAt), "MMM dd, yyyy • HH:mm")}
        </time>
      </div>
    </div>
  );
};

export const BoardActivitySheet = ({ recentTasks }: { recentTasks: Task[] }) => {
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id || null));
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="rounded-md transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
          aria-label="Activity Log"
        >
          <History className="h-4 w-4 transition-colors" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-500" />
            Board Activity
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden p-6 pt-4">
          {recentTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-center text-muted-foreground">
                No activity on this board yet.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-4 md:before:ml-4 before:-translate-x-px md:before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-linear-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent mt-2 pb-6">
                {recentTasks.map((task) => (
                  <RecentActivityItem key={`board-act-${task.id}`} task={task} currentUserId={currentUserId} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
