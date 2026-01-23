import { AppState } from "@/types/state";
import { Action, ADD_BOARD } from "./actions";

export const boardReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ADD_BOARD:
      const { board } = action.payload;

      return {
        ...state,
        boards: {
          ...state.boards,
          [board.id]: board,
        },
      };

    default:
      return state;
  }
};
