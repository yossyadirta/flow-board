import { Board } from "./board";
import { Task } from "./task";

export type AppState = {
  boards: Record<string, Board>;
  tasks: Record<string, Task>;
};
