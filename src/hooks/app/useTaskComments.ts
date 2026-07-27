"use client";

import { TaskComment } from "@/types/task";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useTaskComments = (taskId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!taskId) return;

    const channelName = `task-comments-${taskId}-${Math.random()}`;
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task_comments', filter: `task_id=eq.${taskId}` },
        (payload) => {
          console.log("Realtime comment event:", payload);
          queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, queryClient]);

  const { data: comments = [], isLoading } = useQuery<TaskComment[]>({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      if (!taskId) return [];

      const { data, error } = await supabase
        .from("task_comments")
        .select("*, author:profiles!user_id(name, bg_color)")
        .eq("task_id", taskId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((comment: any) => ({
        id: comment.id,
        task_id: comment.task_id,
        user_id: comment.user_id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: Array.isArray(comment.author) ? comment.author[0] : comment.author,
      }));
    },
    enabled: !!taskId,
  });

  const { mutate: addComment, isPending: isAdding } = useMutation({
    mutationFn: async (content: string) => {
      if (!taskId) throw new Error("No task ID");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("task_comments")
        .insert([
          {
            task_id: taskId,
            user_id: user.id,
            content,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
    onError: (error) => {
      toast.error("Failed to add comment", {
        description: error.message,
      });
    }
  });

  return {
    comments,
    isLoading,
    addComment,
    isAdding,
  };
};
