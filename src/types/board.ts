import { BoardIconId } from "@/components/board/BoardIcons";

export type Board = {
  id: string;
  icon: BoardIconId;
  name: string;
  createdAt?: number;
};
