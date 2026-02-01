"use client";

import { Task, TaskStatus } from "@/types/task";
import { useAppState } from "./useAppState";
import { generateId } from "@/lib/id";
import {
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK_CONTENT,
  UPDATE_TASK_ORDER,
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

  const updateTaskContent = (task: Task) => {
    dispatch({
      type: UPDATE_TASK_CONTENT,
      payload: {
        task,
      },
    });
  };

  const updateTaskOrder = (
    taskId: string,
    order: number,
    status: TaskStatus,
  ) => {
    dispatch({
      type: UPDATE_TASK_ORDER,
      payload: {
        taskId,
        order,
        status,
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
    updateTaskContent,
    updateTaskOrder,
    updateTaskStatus,
    deleteTask,
  };
};
