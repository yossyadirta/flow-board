export interface BoardMember {
  board_id: string;
  user_id: string;
  role: "owner" | "member";
  profiles?: {
    name: string;
    email: string;
    bg_color: string;
  };
}
