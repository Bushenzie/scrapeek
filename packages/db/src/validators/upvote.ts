import { createInsertSchema, createUpdateSchema, createSelectSchema } from "drizzle-orm/zod";
import { upvote } from "../schemas/upvote";
import type { z } from "zod";

export const upvoteSelectSchema = createSelectSchema(upvote);

export const upvoteInsertSchema = createInsertSchema(upvote).omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const upvoteUpdateSchema = createUpdateSchema(upvote).pick({});

export type Upvote = z.infer<typeof upvoteSelectSchema>;
