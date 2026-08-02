"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const usePresence = (boardId: string, currentUserId: string | null) => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!boardId || !currentUserId) return;

    // Create a unique channel for this specific board
    const channel = supabase.channel(`board-presence-${boardId}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users = new Set<string>();

        // Extract all online user IDs from the presence state
        for (const [key] of Object.entries(state)) {
          users.add(key);
        }

        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Broadcast that we are online
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      // Cleanup when unmounting or leaving the board
      supabase.removeChannel(channel);
    };
  }, [boardId, currentUserId]);

  return { onlineUsers };
};
