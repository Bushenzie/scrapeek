import { z } from "zod";

export const upvoteSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  blueprintId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Upvote = z.infer<typeof upvoteSchema>;
