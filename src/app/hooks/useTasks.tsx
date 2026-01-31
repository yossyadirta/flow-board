"use client";

import { Task, TaskStatus } from "@/types/task";
import { useAppState } from "./useAppState";
import { generateId } from "@/lib/id";
import {
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  UPDATE_TASK_STATUS,
} from "../state/actions";

export const useTasks = () => {
  const { state, dispatch } = useAppState();

  const tasks = Object.values(state.tasks);

  const addTask = (boardId: string, title: string, status: TaskStatus) => {
    const task: Task = {
      id: generateId(),
      boardId,
      title,
      status,
      order: 0,
      createdAt: Date.now(),
    };

    dispatch({
      type: ADD_TASK,
      payload: {
        task,
      },
    });
  };

  const updateTask = (task: Task) => {
    dispatch({
      type: UPDATE_TASK,
      payload: {
        task,
      },
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    dispatch({
      type: UPDATE_TASK_STATUS,
      payload: {
        taskId,
        status,
      },
    });
  };

  const deleteTask = (taskId: string) => {
    dispatch({
      type: DELETE_TASK,
      payload: {
        taskId,
      },
    });
  };

  return {
    tasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
};
