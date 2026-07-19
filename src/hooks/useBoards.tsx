"use client";

import { Board } from "@/types/board";
import { BoardIconId } from "@/components/app/board/BoardIcons";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type AddBoardPayload = {
  name: string;
  icon: BoardIconId;
  key: string;
};

export const useBoards = () => {
  const queryClient = useQueryClient();

  // Query to fetch all boards where the user is a member (RLS will automatically restrict this)
  const { data: boards = [], isLoading, isFetching } = useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((board: any) => ({
        id: board.id,
        key: board.key,
        icon: board.icon as BoardIconId,
        name: board.name,
        createdAt: new Date(board.created_at).getTime(),
        isFavorite: board.is_favorite,
        taskCounter: board.task_counter,
      }));
    },
  });

  // Mutation to add a new board
  const addBoardMutation = useMutation({
    mutationFn: async (data: AddBoardPayload) => {
      const { data: board, error } = await supabase
        .from("boards")
        .insert({
          key: data.key,
          name: data.name,
          icon: data.icon,
          is_favorite: false,
          task_counter: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return board;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  // Mutation to delete a board
  const deleteBoardMutation = useMutation({
    mutationFn: async (boardId: string) => {
      const { error } = await supabase
        .from("boards")
        .delete()
        .eq("id", boardId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  // Mutation to update board details (optimistic update)
  const updateBoardMutation = useMutation({
    mutationFn: async (board: Board) => {
      const { error } = await supabase
        .from("boards")
        .update({
          name: board.name,
          icon: board.icon,
          key: board.key,
          is_favorite: board.isFavorite,
          task_counter: board.taskCounter,
        })
        .eq("id", board.id);

      if (error) throw error;
    },
    onMutate: async (newBoard) => {
      await queryClient.cancelQueries({ queryKey: ["boards"] });
      const previousBoards = queryClient.getQueryData<Board[]>(["boards"]);

      queryClient.setQueryData<Board[]>(["boards"], (old) =>
        old ? old.map((b) => (b.id === newBoard.id ? newBoard : b)) : []
      );

      return { previousBoards };
    },
    onError: (err, newBoard, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(["boards"], context.previousBoards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  // Mutation to toggle favorite status (optimistic update)
  const updateBoardFavoriteMutation = useMutation({
    mutationFn: async ({ boardId, isFavorite }: { boardId: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from("boards")
        .update({ is_favorite: isFavorite })
        .eq("id", boardId);

      if (error) throw error;
    },
    onMutate: async ({ boardId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["boards"] });
      const previousBoards = queryClient.getQueryData<Board[]>(["boards"]);

      queryClient.setQueryData<Board[]>(["boards"], (old) =>
        old ? old.map((b) => (b.id === boardId ? { ...b, isFavorite } : b)) : []
      );

      return { previousBoards };
    },
    onError: (err, variables, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(["boards"], context.previousBoards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const addBoard = async (data: AddBoardPayload) => {
    const result = await addBoardMutation.mutateAsync(data);
    return result.key;
  };

  const deleteBoard = async (boardId: string) => {
    await deleteBoardMutation.mutateAsync(boardId);
  };

  const updateBoard = async (board: Board) => {
    await updateBoardMutation.mutateAsync(board);
  };

  const updateBoardFavorite = async (boardId: string) => {
    const board = boards.find((item) => item.id === boardId);
    if (!board) return;
    await updateBoardFavoriteMutation.mutateAsync({
      boardId,
      isFavorite: !board.isFavorite,
    });
  };

  return {
    boards,
    isLoading,
    isFetching,
    addBoard,
    deleteBoard,
    updateBoard,
    updateBoardFavorite,
  };
};
