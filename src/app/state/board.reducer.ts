import { AppState } from "@/types/state";
import { Action, ADD_BOARD, DELETE_BOARD, UPDATE_BOARD } from "./actions";

export const boardReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ADD_BOARD: {
      const { board } = action.payload;

      return {
        ...state,
        boards: {
          ...state.boards,
          [board.id]: board,
        },
      };
    }

    case DELETE_BOARD: {
      const { boardId } = action.payload;
      const newBoards = { ...state.boards };
      delete newBoards[boardId];

      const newTasks = Object.fromEntries(
        Object.entries(state.tasks).filter(
          ([, item]) => item.boardId !== boardId,
        ),
      );

      return {
        boards: newBoards,
        tasks: newTasks,
      };
    }

    case UPDATE_BOARD: {
      const { board } = action.payload;

      return {
        ...state,
        boards: {
          ...state.boards,
          [board.id]: board,
        },
      };
    }

    default:
      return state;
  }
};
