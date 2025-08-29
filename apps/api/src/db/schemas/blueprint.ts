import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const configTypeEnum = pgEnum("type", ["api", "static", "dynamic"]);

export const blueprintTable = pgTable("blueprint", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  type: configTypeEnum("type").notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  baseUrl: varchar("base_url", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
