"use client";

import { Bell, Check, CircleAlert, MessageSquare, UserPlus, Activity, Info, Circle, Timer, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/hooks/app/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { AppNotification } from "@/types/notification";

const getNotificationConfig = (type: string) => {
  if (type.startsWith('status_change:')) {
    const status = type.split(':')[1];
    switch (status) {
      case 'todo':
        return { icon: Circle, color: "text-muted-foreground", bg: "bg-muted" };
      case 'in-progress':
        return { icon: Timer, color: "text-blue-500", bg: "bg-blue-500/10" };
      case 'done':
        return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      default:
        return { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    }
  }

  switch (type) {
    case 'comment':
      return { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" };
    case 'assignment':
      return { icon: UserPlus, color: "text-purple-500", bg: "bg-purple-500/10" };
    default:
      return { icon: Info, color: "text-gray-500", bg: "bg-gray-500/10" };
  }
};

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-10 h-10 rounded-md bg-transparent text-muted-foreground flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" side="right" className="w-80 p-0 shadow-lg border-muted/60" sideOffset={16}>
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:bg-transparent"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
              <Bell className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-sm">You have no notifications.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {notifications.map((notification) => {
                const config = getNotificationConfig(notification.type);
                const Icon = config.icon;
                
                return (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "flex items-start gap-3 p-4 transition-colors hover:bg-muted/30 cursor-pointer",
                      !notification.is_read ? "bg-primary/5" : "opacity-75"
                    )}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      config.bg, config.color
                    )}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !notification.is_read && "font-medium")}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
