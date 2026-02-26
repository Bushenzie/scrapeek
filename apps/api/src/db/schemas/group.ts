import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { blueprintGroupTable } from "./blueprint-group";
import { user } from "./auth";

export const groupTable = pgTable("group", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const groupRelations = relations(groupTable, ({ one, many }) => ({
  blueprints: many(blueprintGroupTable),
  user: one(user, {
    fields: [groupTable.userId],
    references: [user.id],
  }),
}));
