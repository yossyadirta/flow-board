"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTaskComments } from "@/hooks/app/useTaskComments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { SendIcon, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  taskId: string;
};

export function TaskComments({ taskId }: Props) {
  const { comments, isLoading, addComment, isAdding } = useTaskComments(taskId);
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isAdding) return;

    addComment(content.trim(), {
      onSuccess: () => {
        setContent("");
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary/30 rounded-xl overflow-hidden border">
      <div className="px-4 py-3 border-b bg-muted/40">
        <h3 className="font-semibold flex items-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          Activity & Comments
        </h3>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-4" ref={scrollRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground space-y-2">
            <MessageSquare className="w-8 h-8 opacity-20" />
            <p className="text-sm">No comments yet. Be the first to start the discussion!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            {comments.map((comment) => {
              const initials = comment.author?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "?";

              return (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="w-8 h-8 shrink-0 mt-0.5 shadow-sm border border-background">
                    <AvatarFallback
                      className="text-[10px] font-medium text-white"
                      style={{ backgroundColor: comment.author?.bg_color || "#94a3b8" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment.author?.name || "Unknown User"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm bg-background/80 border rounded-2xl rounded-tl-sm px-3 py-2 text-foreground/90 whitespace-pre-wrap break-words leading-relaxed shadow-sm">
                      {comment.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 bg-card border-t shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment... (Press Enter to post)"
            className="min-h-[44px] max-h-32 resize-none rounded-xl pr-12 pb-2 pt-3 shadow-inner bg-background focus-visible:ring-1"
            disabled={isAdding}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!content.trim() || isAdding}
            className={cn(
              "absolute right-2 bottom-2 h-7 w-7 rounded-lg transition-all",
              !content.trim() && "opacity-50"
            )}
          >
            <SendIcon className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
