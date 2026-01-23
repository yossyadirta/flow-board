export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  boardId: string;
  order: number;
  createdAt: number;
};
