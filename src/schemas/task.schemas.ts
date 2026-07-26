import { z } from "zod";

export const TASK_STATUS = [
  { label: "To do", value: "todo" },
  { label: "Doing", value: "in-progress" },
  { label: "Done", value: "done" },
] as const;

export const taskStatusSchema = z.enum(TASK_STATUS.map((item) => item.value));

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  status: taskStatusSchema,
  dueDate: z.date().optional(),
  description: z.string().optional(),
  assigneeId: z.string().nullable().optional(),
  cover: z
    .object({
      type: z.enum(["none", "color", "image"]),
      value: z.string().optional(),
    })
    .optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
