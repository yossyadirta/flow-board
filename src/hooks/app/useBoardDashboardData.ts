"use client";

import { useState, useMemo } from "react";
import { useBoards } from "@/hooks/useBoards";
import { useTasks } from "@/hooks/useTasks";

export const useBoardDashboardData = () => {
  const { boards } = useBoards();
  const { mappedTasks } = useTasks();

  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [isOpenAddBoardModal, setIsOpenAddBoardModal] = useState(false);

  const hasBoards = boards.length > 0;

  const favoriteBoards = useMemo(() => {
    return boards.filter((board) => board.isFavorite === true);
  }, [boards]);

  const hasFavorites = favoriteBoards.length > 0;
  const displayFavorites = favoriteBoards.slice(0, 3);
  const remainingFavoritesCount =
    favoriteBoards.length - displayFavorites.length;

  // Upcoming tasks logic
  const upcomingTasks = useMemo(() => {
    return mappedTasks
      .filter((task) => task.status !== "done" && task.dueDate)
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
      )
      .slice(0, 5);
  }, [mappedTasks]);

  const hasUpcomingTasks = upcomingTasks.length > 0;

  // Recent tasks logic
  const recentTasks = useMemo(() => {
    return [...mappedTasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [mappedTasks]);

  // Helper functions
  const getBoardMetrics = (boardId: string) => {
    const boardTasks = mappedTasks.filter((t) => t.boardId === boardId);
    const total = boardTasks.length;
    if (total === 0) return { progress: 0, done: 0, remaining: 0 };

    const done = boardTasks.filter((t) => t.status === "done").length;
    return {
      progress: Math.round((done / total) * 100),
      done,
      remaining: total - done,
    };
  };

  const getBoardName = (boardId: string) => {
    return boards.find((b) => b.id === boardId)?.name || "Unknown Board";
  };

  return {
    boards,
    mappedTasks,
    showFavoritesModal,
    setShowFavoritesModal,
    isOpenAddBoardModal,
    setIsOpenAddBoardModal,
    hasBoards,
    favoriteBoards,
    hasFavorites,
    displayFavorites,
    remainingFavoritesCount,
    upcomingTasks,
    hasUpcomingTasks,
    recentTasks,
    getBoardMetrics,
    getBoardName,
  };
};
