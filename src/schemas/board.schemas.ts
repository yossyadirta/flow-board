import { z } from "zod";
import { BOARD_ICON_IDS } from "@/components/board/BoardIcons";

export const boardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  icon: z.enum(BOARD_ICON_IDS),
});

export type BoardFormValues = z.infer<typeof boardSchema>;
