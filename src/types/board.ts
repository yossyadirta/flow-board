import { BoardIconId } from "@/components/app/board/BoardIcons";

export type Board = {
  id: string;
  key: string;
  icon: BoardIconId;
  name: string;
  createdAt: number | string;
  isFavorite: boolean;
  taskCounter: number;
  owner_id?: string;
};
