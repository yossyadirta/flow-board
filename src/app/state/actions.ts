import { Board } from "@/types/board";
import { Task, TaskStatus } from "@/types/task";

export const ADD_BOARD = "ADD_BOARD";
export const DELETE_BOARD = "DELETE_BOARD";
export const UPDATE_BOARD = "UPDATE_BOARD";

export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const UPDATE_TASK_STATUS = "UPDATE_TASK_STATUS";

/* =========================
  BOARD ACTIONS
========================= */
export type AddBoardAction = {
  type: typeof ADD_BOARD;
  payload: {
    board: Board;
  };
};

export type DeleteBoardAction = {
  type: typeof DELETE_BOARD;
  payload: {
    boardId: string;
  };
};

export type UpdateBoardAction = {
  type: typeof UPDATE_BOARD;
  payload: {
    board: Board;
  };
};

/* =========================
  TASK ACTIONS
========================= */
export type AddTaskAction = {
  type: typeof ADD_TASK;
  payload: {
    task: Task;
  };
};

export type DeleteTaskAction = {
  type: typeof DELETE_TASK;
  payload: {
    taskId: string;
  };
};

export type UpdateTaskAction = {
  type: typeof UPDATE_TASK;
  payload: {
    task: Task;
  };
};

export type UpdateTaskStatusAction = {
  type: typeof UPDATE_TASK_STATUS;
  payload: {
    taskId: string;
    status: TaskStatus;
  };
};

/* =========================
  UNION ACTION
========================= */
export type Action =
  | AddBoardAction
  | DeleteBoardAction
  | UpdateBoardAction
  | AddTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | UpdateTaskStatusAction;
