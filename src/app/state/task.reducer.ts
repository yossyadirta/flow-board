import { AppState } from "@/types/state";
import {
  Action,
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  UPDATE_TASK_STATUS,
} from "./actions";

export const taskReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ADD_TASK: {
      const { task } = action.payload;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.id]: task,
        },
      };
    }

    case DELETE_TASK: {
      const { taskId } = action.payload;
      const newTasks = { ...state.tasks };
      delete newTasks[taskId];

      return {
        ...state,
        tasks: newTasks,
      };
    }

    case UPDATE_TASK: {
      const { task } = action.payload;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.id]: task,
        },
      };
    }

    case UPDATE_TASK_STATUS: {
      const { taskId, status } = action.payload;
      const task = state.tasks[taskId];

      if (!task) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            status,
          },
        },
      };
    }

    default:
      return state;
  }
};
