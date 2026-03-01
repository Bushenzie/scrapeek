import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { blueprint } from "./blueprint";

export const result = pgTable("result", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  blueprintId: uuid("blueprint_id")
    .references(() => blueprint.id, { onDelete: "cascade" })
    .notNull(),
  data: jsonb("data").notNull().default({}),
});
