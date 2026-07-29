import React from "react";
import { CheckCircle2, PlusCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Task } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const RecentActivityItem = ({ task, currentUserId }: { task: Task, currentUserId: string | null }) => {
  const isDone = task.status === "done";

  const authorName = task.author?.name || "Someone";
  const isMe = currentUserId && task.author?.id === currentUserId;
  const displayName = isMe ? "You" : authorName;
  const initials = authorName.charAt(0).toUpperCase();

  return (
    <div className="group flex gap-3 p-2.5 rounded-xl hover:bg-secondary/80 transition-all cursor-default items-start">
      <div className="relative shrink-0 mt-0.5">
        <Avatar className="w-6 h-6 rounded-full ring-1 ring-border/50">
          <AvatarFallback style={{ backgroundColor: task.author?.bg_color || "#9CA3AF" }} className="text-white text-[9px] font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-[2px]">
          {isDone ? (
            <CheckCircle2 className="w-3 h-3 text-primary bg-card rounded-full" />
          ) : (
            <PlusCircle className="w-3 h-3 text-blue-500 bg-card rounded-full" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-foreground truncate">{displayName}</span>
          <span className="text-[11px] text-muted-foreground shrink-0">{isDone ? "completed" : "created"} task</span>
        </div>

        <p className="text-xs font-medium text-foreground/90 truncate mt-0.5 group-hover:text-primary transition-colors">
          {task.title}
        </p>

        <div className="flex items-center gap-1 mt-1.5">
          <Clock className="w-3 h-3 text-muted-foreground/40" />
          <time className="text-[10px] text-muted-foreground/80 font-medium capitalize">
            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </time>
        </div>
      </div>
    </div>
  );
};

export const RecentActivitiesCard = ({
  recentTasks,
  className,
}: {
  recentTasks: Task[];
  className?: string;
}) => {
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id || null));
  }, []);

  return (
    <Card className={cn("flex flex-col border-0 shadow-none bg-card p-0 gap-0 h-full overflow-hidden", className)}>
      <CardHeader className="shrink-0 px-3 pt-3 border-border/40">
        <CardTitle className="text-sm md:text-base flex items-center text-foreground/90">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 xl:min-h-0 bg-gradient-to-b from-card to-background/30">
        {recentTasks.length === 0 ? (
          <div className="flex items-center justify-center h-full py-10">
            <p className="text-sm text-center text-muted-foreground">
              No recent activity.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-auto xl:h-full px-2 py-2">
            <div className="space-y-1">
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
