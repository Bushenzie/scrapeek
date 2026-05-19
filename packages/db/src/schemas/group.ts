import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const group = pgTable("group", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
