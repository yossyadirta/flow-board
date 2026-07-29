"use client";

import { useBoards } from "@/hooks/useBoards";
import { toast } from "sonner";
import { formatDueDate } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Props = {
  boardId: string;
};

export const useBoardActions = ({ boardId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { boards, deleteBoard, updateBoardFavorite } = useBoards();

  const updateQueries = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const getNextBoardId = () => {
    const index = boards.findIndex((item) => item.id === boardId);
    if (index === -1) return null;
    if (boards[index + 1]) return boards[index + 1].key;
    if (boards[index - 1]) return boards[index - 1].key;

    return null;
  };

  const handleDeleteBoard = () => {
    const nextBoardKey = getNextBoardId();
    deleteBoard(boardId);

    if (nextBoardKey) {
      router.push(`/app/board/${nextBoardKey}`);
    } else {
      router.push("/app");
    }
    toast.success("Board has been deleted", {
      description: formatDueDate(new Date(), true),
      position: "top-center",
    });
  };

  const onToggleFavorite = (boardId: string) => {
    const board = boards.find((item) => item.id === boardId);
    if (!board) return;
    const isFavorite = board.isFavorite;
    updateBoardFavorite(boardId);
    toast.success(
      `Board has been ${!isFavorite ? "added to" : "removed from"} favorites`,
      {
        description: formatDueDate(new Date(), true),
        position: "top-center",
      },
    );
  };

  const setSearch = (value: string) => updateQueries({ search: value });

  const setFilter = (value: string) => updateQueries({ filter: value });

  const setView = (value: string) => {
    updateQueries({
      view: value,
      search: "",
      filter: "",
    });
  };
  return {
    handleDeleteBoard,
    onToggleFavorite,
    setSearch,
    setFilter,
    setView,
  };
};
