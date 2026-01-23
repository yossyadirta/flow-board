import { AppState } from "@/types/state";
import { Action } from "./actions";
import { boardReducer } from "./board.reducer";
import { taskReducer } from "./task.reducer";

export const rootReducer = (state: AppState, action: Action): AppState => {
  const afterBoard = boardReducer(state, action);
  const afterTask = taskReducer(afterBoard, action);

  return afterTask;
};
