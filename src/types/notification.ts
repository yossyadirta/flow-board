export type AppNotification = {
  id: string;
  user_id: string;
  type: "assignment" | "comment" | string;
  message: string;
  task_id?: string;
  is_read: boolean;
  created_at: string;
};
