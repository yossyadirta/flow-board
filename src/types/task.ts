export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskCover =
  | { type: "none" }
  | { type: "color"; value: string }
  | { type: "image"; value: string };

export type Task = {
  id: string;
  key: string;
  title: string;
  status: TaskStatus;
  boardId: string;
  order: number;
  createdAt: number | string;
  updatedAt?: number | string;
  dueDate?: Date | string;
  cover?: TaskCover;
  description?: string;
  author?: {
    id: string;
    name: string;
    bg_color: string;
  };
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    bg_color: string;
  };
};
