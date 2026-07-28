"use client";

import { AppNotification } from "@/types/notification";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

let notificationsSubscriberCount = 0;
let notificationsChannel: ReturnType<typeof supabase.channel> | null = null;

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserId(session?.user?.id ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    notificationsSubscriberCount++;

    if (notificationsSubscriberCount === 1) {
      notificationsChannel = supabase.channel(`notifications-${userId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
          (payload) => {
            console.log("Realtime notification received:", payload);
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
            
            // Optionally show a toast for new notifications if they arrive while user is active
            if (payload.new && payload.new.message) {
              toast(payload.new.type === 'assignment' ? 'New Task Assigned' : 'New Comment', {
                description: payload.new.message,
                position: "top-right",
              });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
          }
        )
        .subscribe();
    }

    return () => {
      notificationsSubscriberCount--;
      if (notificationsSubscriberCount === 0 && notificationsChannel) {
        supabase.removeChannel(notificationsChannel);
        notificationsChannel = null;
      }
    };
  }, [userId, queryClient]);

  const { data: notifications = [], isLoading } = useQuery<AppNotification[]>({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
};
