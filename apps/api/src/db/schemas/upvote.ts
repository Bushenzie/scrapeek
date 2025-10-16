import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.ts";
import { blueprintTable } from "./blueprint";

export const upvoteTable = pgTable("upvote", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  blueprintId: uuid("blueprint_id")
    .references(() => blueprintTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const upvoteRelations = relations(upvoteTable, ({ one }) => ({
  user: one(user, {
    fields: [upvoteTable.userId],
    references: [user.id],
  }),
  blueprint: one(blueprintTable, {
    fields: [upvoteTable.blueprintId],
    references: [blueprintTable.id],
  }),
}));
