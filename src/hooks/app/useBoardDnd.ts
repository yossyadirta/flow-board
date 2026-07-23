"use client";
import { useTasks } from "@/hooks/useTasks";
import { TASK_STATUS } from "@/schemas/task.schemas";
import { Task, TaskStatus } from "@/types/task";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { OnboardingEvent } from "@/context/OnboardingContext";

type Props = {
  boardId: string;
  onboardingSignal?: (event: OnboardingEvent) => void;
};

export const useBoardDnd = ({ boardId, onboardingSignal }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const { tasks, mappedTasks, deleteTask, updateTaskDragAndDrop } = useTasks();

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const getColumnTasks = (status: string) => {
    return mappedTasks
      .filter((t) => t.status === status && t.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  };

  const commitTasks = (array: Task[]) => {
    const newTasks: Record<string, Task> = {};
    array.forEach((item) => {
      newTasks[item.id] = item;
    });
    updateTaskDragAndDrop(newTasks);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // current dragged task
    const activeTask = tasks[activeId];
    if (!activeTask) return;

    // target drag task
    const overTask = tasks[overId];

    let newTasks = [...mappedTasks];

    // check is target is a status column
    const isColumn = TASK_STATUS.some((status) => status.value === overId);

    // target columns are empty (no task available)
    // overId is Column Id (e.g: todo | inprogress | done)
    if (isColumn && activeTask.status !== overId) {
      // change the status of the selected task
      newTasks = newTasks.map((item) =>
        item.id === activeId ? { ...item, status: overId as TaskStatus } : item,
      );
    }

    // target columns already have an items
    // overId is Task Id (tasks[id])
    if (overTask && activeTask.status !== overTask.status) {
      // change the status of the selectedTask by target status
      newTasks = newTasks.map((item) =>
        item.id === activeId ? { ...item, status: overTask.status } : item,
      );
    }

    // if drag to task, use target status, if drag to column but empty, use overId
    const targetStatus = overTask?.status ?? (isColumn ? overId : null);

    if (targetStatus) {
      // Reindex order
      const columnTasks = newTasks
        .filter(
          (item) =>
            item.status === targetStatus && item.boardId === activeTask.boardId,
        )
        .sort((a, b) => a.order - b.order);

      columnTasks.forEach((task, index) => {
        const i = newTasks.findIndex((item) => item.id === task.id);
        newTasks[i] = { ...task, order: index };
      });

      commitTasks(newTasks);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks[activeId];
    const overTask = tasks[overId];

    if (!activeTask) return;

    const newTasks = [...mappedTasks];

    // if dragged task dropped on the same column
    if (overTask && activeTask.status === overTask.status) {
      // get all task in those columns
      const columnTasks = getColumnTasks(activeTask.status);

      const oldIndex = columnTasks.findIndex((item) => item.id === activeId);
      const newIndex = columnTasks.findIndex((item) => item.id === overId);

      const reordered = arrayMove(columnTasks, oldIndex, newIndex);

      reordered.forEach((task, index) => {
        const i = newTasks.findIndex((t) => t.id === task.id);
        newTasks[i] = { ...task, order: index };
      });
    }

    commitTasks(newTasks);

    // Signal onboarding events for drag & drop
    if (onboardingSignal && activeTask) {
      const finalTask = newTasks.find((t) => t.id === activeId);
      if (finalTask && finalTask.status !== activeTask.status) {
        if (finalTask.status === "in-progress") {
          onboardingSignal("task-moved-to-inprogress");
        } else if (finalTask.status === "done") {
          onboardingSignal("task-moved-to-done");
        }
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return {
    activeId,

    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDragCancel,

    handleDeleteTask,
  };
};
