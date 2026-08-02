"use client";

import { BOARD_ICONS_MAP } from "@/components/app/board/BoardIcons";
import { useBoards } from "@/hooks/useBoards";
import { useTasks } from "@/hooks/useTasks";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  boardId: string;
};

export const useBoardDerived = ({ boardId }: Props) => {
  const { mappedTasks } = useTasks();
  const { boards } = useBoards();

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "all";

  const allowedViews = ["kanban", "list", "table", "calendar"] as const;
  type View = (typeof allowedViews)[number];

  const isValidView = (value: string | null): value is View => {
    return !!value && allowedViews.includes(value as View);
  };

  const rawView = searchParams.get("view");
  const view: View = isValidView(rawView) ? rawView : "kanban";

  const currentBoard = useMemo(() => {
    if (!boardId) return null;

    return boards.find((item) => item.id === boardId) ?? null;
  }, [boardId, boards]);

  const { emoji } =
    BOARD_ICONS_MAP[
      (currentBoard?.icon ?? "briefcase") as keyof typeof BOARD_ICONS_MAP
    ];

  const isToday = (date: Date | string | undefined) => {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();

    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const isOverdue = (date: Date | string | undefined) => {
    if (!date) return false;

    const d = new Date(date);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    return target < today;
  };

  const visibleTasks = useMemo(() => {
    return mappedTasks.filter((task) => {
      if (task.boardId !== boardId) return false;

      if (filter === "today" && !isToday(task.dueDate)) return false;
      if (filter === "overdue" && !isOverdue(task.dueDate)) return false;

      if (search && !task.title.toLowerCase().includes(search.toLowerCase()))
        return false;

      return true;
    });
  }, [filter, search, mappedTasks, boardId]);

  const totalTask =
    mappedTasks.filter((item) => item.boardId === boardId).length || 0;
  const totalTodoTask =
    visibleTasks.filter(
      (item) => item.boardId === boardId && item.status === "todo",
    ).length || 0;
  const totalInprogressTask =
    visibleTasks.filter(
      (item) => item.boardId === boardId && item.status === "in-progress",
    ).length || 0;
  const totalDoneTask =
    visibleTasks.filter(
      (item) => item.boardId === boardId && item.status === "done",
    ).length || 0;
  const taskProgress =
    totalTask === 0
      ? 0
      : Math.round(
          (mappedTasks.filter(
            (item) => item.boardId === boardId && item.status === "done",
          ).length || 0 / totalTask) * 100,
        );

  const recentTasks = useMemo(() => {
    return mappedTasks
      .filter((task) => task.boardId === boardId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [mappedTasks, boardId]);

  return {
    visibleTasks,
    currentBoard,
    totalDoneTask,
    totalInprogressTask,
    totalTask,
    totalTodoTask,
    taskProgress,
    emoji,
    search,
    filter,
    view,
    recentTasks,
  };
};
