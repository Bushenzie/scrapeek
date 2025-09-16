import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { blueprintTable } from "./blueprint.ts";

export const resultTable = pgTable("result", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  blueprintId: uuid("blueprint_id")
    .references(() => blueprintTable.id)
    .notNull(),
  data: jsonb("data").notNull().default({}),
});
