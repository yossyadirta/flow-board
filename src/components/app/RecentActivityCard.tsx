import React from "react";
import { History, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

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

export const RecentActivitiesCard = ({
  recentTasks,
}: {
  recentTasks: Task[];
}) => {
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id || null));
  }, []);

  return (
    <Card className="flex flex-col shadow-sm border-slate-200/60 dark:border-slate-800 bg-gradient-linear-to-b from-transparent to-slate-50/30 dark:to-slate-900/30 xl:flex-1 xl:min-h-0 py-2 gap-4">
      <CardHeader className="shrink-0 p-4 pl-8">
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          <History className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 xl:min-h-0">
        {recentTasks.length === 0 ? (
          <div className="flex items-center justify-center h-full py-10">
            <p className="text-sm text-center text-muted-foreground">
              No recent activity.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-auto xl:h-full px-4 md:px-6 pb-6">
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-4 md:before:ml-4 before:-translate-x-px md:before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-linear-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent mt-2">
              {recentTasks.map((task) => (
                <RecentActivityItem key={`act-${task.id}`} task={task} currentUserId={currentUserId} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
