import { generateId } from "@/lib/id";
import { AppState } from "@/types/state";

const initialBoardId = generateId();

export const initialState: AppState = {
  boards: {
    [initialBoardId]: {
      id: initialBoardId,
      title: "Main Board",
      createdAt: Date.now(),
    },
  },
  tasks: {},
};
