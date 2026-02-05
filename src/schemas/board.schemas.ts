import { z } from "zod";

export const boardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  icon: z.string(),
});

export type BoardFormValues = z.infer<typeof boardSchema>;
