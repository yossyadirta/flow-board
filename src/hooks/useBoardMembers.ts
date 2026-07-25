"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BoardMember } from "@/types/member";

export const useBoardMembers = (boardId: string) => {
  const queryClient = useQueryClient();

  // Query to fetch all members for a board
  const { data: members = [], isLoading } = useQuery<BoardMember[]>({
    queryKey: ["board_members", boardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("board_members")
        .select(`
          board_id,
          user_id,
          role,
          profiles (
            name,
            email,
            bg_color
          )
        `)
        .eq("board_id", boardId)
        .order("role", { ascending: false }); // Sort so owner is usually first (o > m)

      if (error) throw error;
      
      // Map it to ensure array structure is flattened for profiles
      return (data || []).map((m: any) => ({
        board_id: m.board_id,
        user_id: m.user_id,
        role: m.role,
        profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles,
      }));
    },
    enabled: !!boardId,
  });

  // Mutation to invite a member
  const inviteMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      // Call the RPC function we created in SQL
      const { data, error } = await supabase.rpc('invite_user_by_email', {
        p_board_id: boardId,
        p_invite_email: email
      });

      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board_members", boardId] });
    },
  });

  // Mutation to remove a member
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("board_members")
        .delete()
        .eq("board_id", boardId)
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Gagal menghapus member (Akses ditolak oleh database)");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board_members", boardId] });
    },
  });

  return {
    members,
    isLoading,
    inviteMember: async (email: string) => {
      return await inviteMemberMutation.mutateAsync(email);
    },
    removeMember: async (userId: string) => {
      await removeMemberMutation.mutateAsync(userId);
    },
    isInviting: inviteMemberMutation.isPending,
  };
};
